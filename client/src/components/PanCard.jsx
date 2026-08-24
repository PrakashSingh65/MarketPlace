import React, { useState } from 'react';
import { CreditCard, CheckCircle, Upload } from 'lucide-react';

export default function PanCard() {
  const [panData, setPanData] = useState({
    panNumber: '',
    fullName: '',
    isDeclarationAccepted: false
  });
  const [panFile, setPanFile] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!panData.panNumber || panData.panNumber.length !== 10) {
      alert('Please enter a valid 10-character PAN number.');
      return;
    }
    if (!panData.fullName) {
      alert('Please enter full name as per PAN card.');
      return;
    }
    if (!panData.isDeclarationAccepted) {
      alert('Please accept the declaration.');
      return;
    }

    setIsSaved(true);
    alert('PAN Details updated successfully!');
  };

  const handleEdit = () => {
    setIsSaved(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <CreditCard size={20} className="text-blue-600" />
          PAN Card Information
        </h2>
        {isSaved && (
          <button 
            onClick={handleEdit}
            className="text-blue-600 font-bold text-xs hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {isSaved ? (
        <div className="bg-green-50 border border-green-200 p-4 rounded-sm flex items-start gap-3">
          <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={18} />
          <div className="text-xs text-gray-700 flex flex-col gap-1">
            <p className="font-bold text-green-800 text-sm">PAN Details Linked Successfully</p>
            <p><span className="font-semibold text-gray-600">PAN Number:</span> {panData.panNumber}</p>
            <p><span className="font-semibold text-gray-600">Full Name:</span> {panData.fullName}</p>
            {panFile && (
              <p><span className="font-semibold text-gray-600">Document Uploaded:</span> {panFile.name}</p>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs text-gray-700">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-gray-600">PAN Card Number *</label>
            <input 
              type="text" 
              placeholder="e.g. ABCDE1234F"
              value={panData.panNumber}
              maxLength={10}
              onChange={(e) => setPanData({ ...panData, panNumber: e.target.value.toUpperCase() })}
              className="border border-gray-300 p-2.5 rounded-sm bg-slate-50 focus:outline-blue-500 uppercase text-sm font-mono tracking-wide"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-gray-600">Full Name (as on PAN Card) *</label>
            <input 
              type="text" 
              placeholder="Enter Full Name"
              value={panData.fullName}
              onChange={(e) => setPanData({ ...panData, fullName: e.target.value })}
              className="border border-gray-300 p-2.5 rounded-sm bg-slate-50 focus:outline-blue-500 text-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-gray-600 flex items-center gap-1">
              <Upload size={14} /> Upload PAN Card Image (Optional)
            </label>
            <input 
              type="file" 
              accept="image/*,.pdf"
              onChange={(e) => setPanFile(e.target.files[0])}
              className="border border-gray-300 p-2 rounded-sm bg-slate-50 text-xs file:mr-4 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          <div className="flex items-start gap-2 mt-2">
            <input 
              type="checkbox" 
              id="declaration" 
              checked={panData.isDeclarationAccepted}
              onChange={(e) => setPanData({ ...panData, isDeclarationAccepted: e.target.checked })}
              className="mt-0.5 cursor-pointer"
            />
            <label htmlFor="declaration" className="text-gray-500 leading-tight cursor-pointer">
              I declare that the PAN details provided above are true and correct.
            </label>
          </div>

          <button 
            type="submit" 
            className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-sm hover:bg-blue-700 w-fit mt-2 transition-all shadow-sm"
          >
            SAVE & UPLOAD
          </button>
        </form>
      )}
    </div>
  );
}