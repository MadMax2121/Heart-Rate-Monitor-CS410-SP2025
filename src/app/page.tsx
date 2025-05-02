'use client';
import React, { useState, useEffect } from 'react';
import HeartBeat from '@/components/HeartBeat';
import EKGGraph from '@/components/EKGGraph';
import SessionStats from '@/components/SessionStats';
import {
  ArrowRight,
  ChevronDown,
  Info,
  AlertCircle,
  Activity,
  Clock
} from 'lucide-react';
import { supabase } from '@/lib/supabase'; 

const App = () => {
  const [inputName, setInputName] = useState('');
  const [submittedName, setSubmittedName] = useState('');
  const [heartRateData, setHeartRateData] = useState<{ bpm: number } | null>(null);
  const [sessionData, setSessionData] = useState<Array<{ bpm: number; timestamp: string }>>([]);
  const [finalReport, setFinalReport] = useState<typeof sessionData | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alertColor, setAlertColor] = useState<string>('bg-cream');
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);

  const handleSubmit = () => {
    if (inputName.trim() !== '') {
      setSubmittedName(inputName.trim());
    }
  };

  const fetchHeartRateData = async () => {
    try {
      const { data, error } = await supabase
        .from('heart_rate_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
  
      if (error) throw error;
      const latest = data?.[0];
      if (!latest || !latest.data) return;
  
      const raw = latest.data;
      const heartRate = raw.heartRate ?? raw.heartRateData ?? null;
      const timestamp = raw.timestamp;
  
      if (!heartRate || !timestamp) return;
  
      const reading = { bpm: heartRate, timestamp };
      setHeartRateData({ bpm: heartRate });
      setSessionData((prev) => [...prev, reading]);
      setError(null);
      setLastUpdated(new Date(timestamp).toLocaleString());
  
      if (heartRate > 120) setAlertColor('bg-rose-50');
      else if (heartRate < 50) setAlertColor('bg-blue-50');
      else setAlertColor('bg-emerald-50');
    } catch (err) {
      setError(' Unable to fetch from Supabase. Retrying...');
      console.error(' Supabase fetch error:', err);
    }
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    setFinalReport(null);
    setSessionData([]);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    setFinalReport(sessionData);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMonitoring) {
      fetchHeartRateData();
      interval = setInterval(fetchHeartRateData, 3000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring]);

  useEffect(() => {
    supabase
      .from('heart_rate_data')
      .select('*')
      .limit(1)
      .then(({ error, data }) => {
        if (error) console.error(' Supabase test failed:', error);
        else console.log(' Supabase table exists and is readable:', data);
      });
  }, []);

  const calculateAverage = () => {
    const valid = sessionData.filter(item => typeof item.bpm === 'number' && !isNaN(item.bpm));
    if (!valid.length) return null;
    const sum = valid.reduce((acc, item) => acc + item.bpm, 0);
    return Math.round(sum / valid.length);
  };

  const getHeartRateStatus = (bpm: number | null) => {
    if (!bpm) return { label: 'Not available', color: 'text-gray-400' };
    if (bpm > 120) return { label: 'Elevated', color: 'text-rose-500' };
    if (bpm < 50) return { label: 'Low', color: 'text-blue-500' };
    return { label: 'Normal', color: 'text-emerald-500' };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className={`flex flex-col items-center min-h-screen w-full transition-colors duration-700 ${alertColor}`}>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white to-transparent opacity-60" />

      {submittedName ? (
        <div className="w-full max-w-4xl px-6 py-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Hi, <span className="text-indigo-600">{submittedName}</span>
              </h1>
              <p className="text-gray-500 flex items-center gap-2">
                <Activity size={16} className="text-indigo-400" />
                <span>Heart Rate Monitor</span>
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              {isMonitoring ? (
                <button
                  onClick={stopMonitoring}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all duration-300"
                >
                  <Clock size={18} />
                  <span>End Session</span>
                </button>
              ) : (
                <button
                  onClick={startMonitoring}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all duration-300"
                >
                  <Activity size={18} />
                  <span>Start Monitoring</span>
                </button>
              )}
            </div>
          </header>

          {/* Visualization and stats */}
          <div className="mb-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Activity className="text-indigo-500" size={20} />
                  EKG Visualization
                </h2>
                {heartRateData && (
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${
                      alertColor === 'bg-rose-50' ? 'bg-rose-400 animate-pulse' :
                      alertColor === 'bg-blue-50' ? 'bg-blue-400 animate-pulse' :
                      'bg-emerald-400'
                    }`} />
                    <span className={`font-medium ${getHeartRateStatus(heartRateData.bpm).color}`}>
                      {getHeartRateStatus(heartRateData.bpm).label}
                    </span>
                  </div>
                )}
              </div>
              <EKGGraph bpm={heartRateData?.bpm || null} />
              <div className="mt-4 flex justify-center">
                <HeartBeat bpm={heartRateData?.bpm || null} />
              </div>
            </div>
          </div>

          {/* Stats and chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Info className="text-indigo-500" size={20} />
                Current Stats
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Current BPM</span>
                  <span className="text-xl font-bold text-indigo-600">
                    {heartRateData?.bpm ?? '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Average BPM</span>
                  <span className="text-xl font-bold text-indigo-600">
                    {calculateAverage() ?? '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-semibold ${heartRateData ? getHeartRateStatus(heartRateData.bpm).color : 'text-gray-400'}`}>
                    {heartRateData ? getHeartRateStatus(heartRateData.bpm).label : 'Not available'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Readings</span>
                  <span className="font-semibold text-gray-700">
                    {sessionData.length}
                  </span>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-700">
                  <AlertCircle size={16} />
                  <p>{error}</p>
                </div>
              )}

              {lastUpdated && (
                <p className="text-gray-400 text-xs mt-4 text-right">
                  Last updated: {lastUpdated}
                </p>
              )}
            </div>

            <SessionStats data={sessionData} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6" />
          </div>

          {/* Session summary */}
          {finalReport && (
            <>
              <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <h3 className="font-semibold text-indigo-700 mb-2 flex items-center gap-2">
                  <Info size={16} />
                  Session Summary
                </h3>
                <div className="text-sm text-gray-700">
                  <div className="flex justify-between mb-1">
                    <span>Total readings:</span>
                    <span className="font-medium">{finalReport.length}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Average BPM:</span>
                    <span className="font-medium">{calculateAverage()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">
                      {finalReport.length > 0 ? `${Math.round(finalReport.length * 3 / 60)} min` : '0 min'}
                    </span>
                  </div>
                </div>
              </div>

              {/* JSON Output */}
              <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 overflow-x-auto">
                <h3 className="font-semibold mb-2">📄 Final Session JSON:</h3>
                <pre className="whitespace-pre-wrap break-words">
                  {JSON.stringify(finalReport, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen w-full">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
            <div className="text-center mb-6">
              <Activity size={48} className="text-indigo-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800">CardioTrack</h1>
              <p className="text-gray-500 mt-2">Heart Rate Monitoring System</p>
            </div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
              What should we call you?
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none"
              placeholder="Enter your name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-6 px-6 py-3 rounded-xl font-medium shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all duration-300"
              disabled={!inputName.trim()}
            >
              <span>Get Started</span>
              <ArrowRight size={18} />
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-8">
            © {new Date().getFullYear()} CardioTrack. All rights reserved.
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
