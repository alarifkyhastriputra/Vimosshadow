
import React, { useState } from 'react';

interface PostCreatorProps {
  onPost: (data: { text: string; photoURL?: string; videoURL?: string }) => void;
}

const PostCreator: React.FC<PostCreatorProps> = ({ onPost }) => {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<{ url: string; type: 'image' | 'video' } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !preview) return;
    
    onPost({ 
      text, 
      photoURL: preview?.type === 'image' ? preview.url : undefined,
      videoURL: preview?.type === 'video' ? preview.url : undefined
    });
    
    setText('');
    setPreview(null);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview({ url: reader.result as string, type });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">New Memory</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Etch your thought..."
            className="w-full h-40 bg-gray-50 border-2 border-black rounded-2xl p-4 text-sm focus:outline-none focus:ring-0 resize-none transition-all placeholder:text-gray-400"
          />
        </div>

        {preview && (
          <div className="relative rounded-2xl overflow-hidden border-2 border-black">
            {preview.type === 'image' ? (
              <img src={preview.url} alt="Preview" className="w-full h-64 object-cover" />
            ) : (
              <video src={preview.url} className="w-full h-64 object-cover" controls muted />
            )}
            <button 
              type="button"
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-lg"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <label className="w-12 h-12 flex items-center justify-center border-2 border-black rounded-full cursor-pointer hover:bg-black hover:text-white transition-all shadow-md active:scale-90">
              <i className="fas fa-camera"></i>
              <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
            </label>
            <div className="flex flex-col justify-center">
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Add Visual</p>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Echo</p>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={!text.trim() && !preview}
            className="bg-black text-white px-10 py-3 rounded-full font-black uppercase tracking-widest hover:opacity-80 transition-opacity shadow-lg active:scale-95 disabled:opacity-20"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostCreator;
