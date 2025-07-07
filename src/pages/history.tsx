import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface HistoryRecord {
  date: string;
  title: string;
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  language: string;
  difficulty: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      });
  }, []);

  // Chuẩn bị dữ liệu cho biểu đồ
  const chartData = {
    labels: history.map(h => new Date(h.date).toLocaleDateString()),
    datasets: [
      {
        label: 'WPM',
        data: history.map(h => h.wpm),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.1)',
        tension: 0.3
      },
      {
        label: 'Accuracy (%)',
        data: history.map(h => h.accuracy),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.1)',
        tension: 0.3,
        yAxisID: 'y1'
      }
    ]
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Biểu đồ tiến bộ luyện gõ' }
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'WPM' } },
      y1: { beginAtZero: true, position: 'right' as const, title: { display: true, text: 'Accuracy (%)' } }
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 24 }}>Lịch sử luyện tập & Biểu đồ tiến bộ</h2>
      {loading ? <div>Đang tải...</div> : (
        <>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 24, marginBottom: 32 }}>
            <Line data={chartData} options={chartOptions} height={120} />
          </div>
          <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Chi tiết lịch sử</h3>
          <div style={{ maxHeight: 400, overflowY: 'auto', background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #0001', padding: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  <th>Ngày</th>
                  <th>Bài</th>
                  <th>WPM</th>
                  <th>Accuracy (%)</th>
                  <th>Thời gian (s)</th>
                  <th>Ngôn ngữ</th>
                  <th>Độ khó</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td>{new Date(h.date).toLocaleString()}</td>
                    <td>{h.title}</td>
                    <td>{h.wpm}</td>
                    <td>{h.accuracy}</td>
                    <td>{Math.round((h.timeElapsed || 0) / 1000)}</td>
                    <td>{h.language}</td>
                    <td>{h.difficulty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
} 