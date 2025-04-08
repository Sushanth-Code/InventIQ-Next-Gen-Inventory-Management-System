import React, { useEffect, useState, useRef } from 'react';
import { inventoryService } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Doughnut } from 'react-chartjs-2';
import { useVoice } from '../contexts/VoiceContext';
// Import the chart configuration
import '../utils/chartConfig';

interface Product {
  id: string;
  name: string;
  category: string;
  supplier: string;
  current_stock: number;
  reorder_level: number;
  purchase_price: number;
  selling_price: number;
  lead_time: number;
  historical_sales: Record<string, number>;
}

const DashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { startListening, stopListening, isListening, transcript, response } = useVoice();
  // Add chart ref
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await inventoryService.getAllProducts();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Calculate key metrics
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.current_stock <= p.reorder_level);
  const outOfStockProducts = products.filter(p => p.current_stock === 0);
  
  // Prepare data for category distribution chart
  const categoryData = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          '#3699FF', '#1BC5BD', '#F64E60', '#FFA800', '#8950FC', '#00A3FF'
        ],
        borderWidth: 0,
      },
    ],
  };

  // Add chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      }
    }
  };

  // Prepare data for stock level overview
  const stockLevelData = [
    {
      name: 'Stock Levels',
      healthy: products.filter(p => p.current_stock > p.reorder_level).length,
      low: lowStockProducts.length,
      out: outOfStockProducts.length,
    }
  ];

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        
        {/* Voice Assistant Button */}
        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center px-4 py-2 rounded-lg ${
            isListening ? 'bg-red-500 text-white' : 'bg-[#3699FF] text-white'
          }`}
        >
          <span className="material-icons mr-2">
            {isListening ? 'mic' : 'mic_none'}
          </span>
          {isListening ? 'Stop Listening' : 'Ask Assistant'}
        </button>
      </div>
      
      {/* Voice Assistant Transcript */}
      {(transcript || response) && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {transcript && (
            <div className="mb-2">
              <span className="font-bold">You said:</span> {transcript}
            </div>
          )}
          {response && (
            <div>
              <span className="font-bold">Assistant:</span> {response}
            </div>
          )}
        </div>
      )}
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#3699FF]">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Total Products</h2>
          <p className="text-3xl font-bold text-gray-800">{totalProducts}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#FFA800]">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Low Stock Items</h2>
          <p className="text-3xl font-bold text-gray-800">{lowStockProducts.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-[#F64E60]">
          <h2 className="text-lg font-semibold text-gray-600 mb-2">Out of Stock</h2>
          <p className="text-3xl font-bold text-gray-800">{outOfStockProducts.length}</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Stock Level Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stockLevelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E6EF" />
              <XAxis dataKey="name" stroke="#7E8299" />
              <YAxis stroke="#7E8299" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="healthy" stroke="#3699FF" name="Healthy Stock" strokeWidth={2} />
              <Line type="monotone" dataKey="low" stroke="#FFA800" name="Low Stock" strokeWidth={2} />
              <Line type="monotone" dataKey="out" stroke="#F64E60" name="Out of Stock" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Categories</h2>
          <div className="h-[300px] flex justify-center items-center" ref={chartRef}>
            {Object.keys(categoryData).length > 0 && (
              <Doughnut data={categoryChartData} options={chartOptions} />
            )}
          </div>
        </div>
      </div>
      
      {/* Low Stock Alerts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Alerts</h2>
        {lowStockProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Product ID</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Name</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Category</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Current Stock</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Reorder Level</th>
                  <th className="py-3 px-4 text-left text-gray-600 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{product.id}</td>
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4">{product.category}</td>
                    <td className="py-3 px-4">{product.current_stock}</td>
                    <td className="py-3 px-4">{product.reorder_level}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.current_stock === 0
                          ? 'bg-red-100 text-red-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {product.current_stock === 0 ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No low stock items found.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;