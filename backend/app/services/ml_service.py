import json
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM
from prophet import Prophet

def prepare_time_series(product):
    """Convert historical sales to time series data."""
    historical_sales = json.loads(product.historical_sales)
    
    # Convert to dataframe
    sales_data = []
    for day, quantity in historical_sales.items():
        sales_data.append({'day': day, 'quantity': quantity})
        
    df = pd.DataFrame(sales_data)
    
    # Sort by day
    df['day_num'] = df['day'].str.extract(r'Day-(\d+)').astype(int)
    df = df.sort_values('day_num')
    
    return df

def lstm_forecast(product, days=30):
    """Use LSTM model to forecast demand."""
    df = prepare_time_series(product)
    
    # If insufficient data, return simple average
    if len(df) < 10:
        avg_sales = df['quantity'].mean()
        return [round(avg_sales) for _ in range(days)]
    
    # Prepare data for LSTM
    data = df['quantity'].values.reshape(-1, 1)
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)
    
    # Create training data
    X, y = [], []
    lookback = 5  # Use 5 days to predict the next
    
    for i in range(lookback, len(scaled_data)):
        X.append(scaled_data[i-lookback:i, 0])
        y.append(scaled_data[i, 0])
        
    X, y = np.array(X), np.array(y)
    X = np.reshape(X, (X.shape[0], X.shape[1], 1))
    
    # Build LSTM model
    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=(X.shape[1], 1)))
    model.add(LSTM(units=50))
    model.add(Dense(units=1))
    
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(X, y, epochs=50, batch_size=32, verbose=0)
    
    # Generate predictions
    last_sequence = scaled_data[-lookback:].reshape(1, lookback, 1)
    predictions = []
    
    for _ in range(days):
        next_pred = model.predict(last_sequence, verbose=0)[0][0]
        predictions.append(next_pred)
        
        # Update sequence for next prediction
        last_sequence = np.append(last_sequence[0, 1:], [[next_pred]], axis=0)
        last_sequence = last_sequence.reshape(1, lookback, 1)
    
    # Inverse transform to get actual quantities
    predictions = np.array(predictions).reshape(-1, 1)
    predictions = scaler.inverse_transform(predictions)
    
    return [max(0, round(x[0])) for x in predictions]  # Ensure non-negative integers

def prophet_forecast(product, days=30):
    """Use Prophet model for demand forecasting."""
    df = prepare_time_series(product)
    
    # If insufficient data, return simple average
    if len(df) < 10:
        avg_sales = df['quantity'].mean()
        return [round(avg_sales) for _ in range(days)]
    
    # Prepare data for Prophet
    prophet_df = pd.DataFrame({
        'ds': pd.to_datetime('2023-01-01') + pd.to_timedelta(df['day_num'], unit='D'),
        'y': df['quantity']
    })
    
    # Train Prophet model
    model = Prophet(daily_seasonality=True)
    model.fit(prophet_df)
    
    # Create future dataframe
    future = model.make_future_dataframe(periods=days)
    forecast = model.predict(future)
    
    # Get the forecast for the next 'days'
    predictions = forecast.tail(days)['yhat'].values
    
    return [max(0, round(x)) for x in predictions]  # Ensure non-negative integers

def forecast_demand(product, days=30):
    """Combine multiple models for better forecasting."""
    # Get forecasts from different models
    lstm_predictions = lstm_forecast(product, days)
    prophet_predictions = prophet_forecast(product, days)
    
    # Simple ensemble (average of both models)
    ensemble_predictions = [(lstm + prophet) / 2 for lstm, prophet in zip(lstm_predictions, prophet_predictions)]
    
    return {
        'lstm': lstm_predictions,
        'prophet': prophet_predictions,
        'ensemble': [round(x) for x in ensemble_predictions]
    }

def recommend_restock(product, is_trending=False):
    """Recommend restock quantity based on forecast and current stock."""
    # Get 30-day forecast
    forecast_results = forecast_demand(product, 30)
    ensemble_forecast = forecast_results['ensemble']
    
    # Calculate total predicted demand for lead time period
    lead_time = product.lead_time
    predicted_demand = sum(ensemble_forecast[:lead_time])
    
    # Calculate safety stock (buffer)
    safety_stock = 0
    if is_trending:
        # Add 30% buffer for trending products
        safety_stock = round(0.3 * predicted_demand)
    else:
        # Standard safety stock calculation
        safety_stock = round(0.2 * predicted_demand)
    
    # Calculate restock quantity
    current_stock = product.current_stock
    reorder_level = product.reorder_level
    
    if current_stock <= reorder_level:
        restock_qty = predicted_demand + safety_stock - current_stock
        restock_qty = max(0, restock_qty)  # Ensure non-negative
    else:
        restock_qty = 0
    
    return {
        'predicted_demand': predicted_demand,
        'safety_stock': safety_stock,
        'recommended_restock': round(restock_qty)
    }