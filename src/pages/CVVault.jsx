import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Eye, Trash2, Download } from 'lucide-react';

const CVVault = () => {
    const [cvs, setCvs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fetchCvs = async () => {
        try {
            const response = await axios.get('http://localhost:8000/cvs');
            setCvs(response.data);
        } catch (error) {
            console.error('Error fetching CVs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCvs();
    }, []);

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('http://localhost:8000/cvs/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await fetchCvs();
            alert('CV Uploaded successfully!');
        } catch (error) {
            console.error('Error uploading CV:', error);
            alert('Upload failed.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-bold">Document Vault</h3>
                    <p className="text-gray-400">Manage and preview your analyzed CVs</p>
                </div>
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        id="cv-upload"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleUpload}
                    />
                    <label
                        htmlFor="cv-upload"
                        className={`cursor-pointer ${uploading ? 'bg-gray-700' : 'bg-blue-600 hover:bg-blue-500'} text-white px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2`}
                    >
                        {uploading ? (
                            <>
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Uploading...
                            </>
                        ) : (
                            'Upload New CV'
                        )}
                    </label>
                </div>
            </div>

            <div className="bg-[#161922] rounded-2xl border border-gray-800 overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-400">Accessing secure vault...</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-900/50 border-b border-gray-800">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">File Name</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Size</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Preview</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {cvs.map((cv, i) => (
                                <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-blue-500" size={20} />
                                            <span className="font-medium">{cv.filename}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {(cv.length / 1024).toFixed(1)} KB
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs text-gray-500 line-clamp-1 w-64">{cv.preview}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors">
                                                <Download size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CVVault;
