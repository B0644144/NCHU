import React, { useState, useEffect } from 'react';
import { notionApi } from '../../api/client';
import { Database, Save, CheckCircle, AlertCircle } from 'lucide-react';

export default function NotionSyncSettings() {
  const [apiKey, setApiKey] = useState('');
  const [databaseId, setDatabaseId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // Load config on mount
    notionApi.getConfig().then(data => {
      if (data.apiKey) setApiKey(data.apiKey);
      if (data.databaseId) setDatabaseId(data.databaseId);
    }).catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await notionApi.setConfig(apiKey, databaseId);
      setMessage({ text: 'Notion Sync settings saved successfully.', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Failed to save settings.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
          <Database size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Notion Sync</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Connect your trips to a Notion Database for two-way synchronization.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Notion Integration Token
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="secret_..."
          />
          <p className="text-xs text-slate-500 mt-1">
            Create an internal integration in your Notion workspace and copy the token.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Target Database ID
          </label>
          <input
            type="text"
            value={databaseId}
            onChange={(e) => setDatabaseId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. 1a2b3c4d5e..."
          />
          <p className="text-xs text-slate-500 mt-1">
            The 32-character ID found in your Notion Database URL. Remember to share the database with your integration!
          </p>
        </div>

        {message && (
          <div className={`p-3 rounded-lg flex items-center gap-2 text-sm \${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
