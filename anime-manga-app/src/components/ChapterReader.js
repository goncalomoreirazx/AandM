import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ChapterReader = () => {
  const { id, chapterId } = useParams();
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-4">Manga {id} - Chapter {chapterId}</h1>
      <div className="border p-4">
        {/* Fake page of a chapter */}
        <img src="https://via.placeholder.com/500x700" alt="Manga page" className="w-full h-auto" />
      </div>
      <div className="flex justify-between mt-4">
        {chapterId > 1 && (
          <Link to={`/manga/${id}/chapter/${parseInt(chapterId) - 1}`} className="text-blue-500">Previous Chapter</Link>
        )}
        <Link to={`/manga/${id}/chapter/${parseInt(chapterId) + 1}`} className="text-blue-500">Next Chapter</Link>
      </div>
    </div>
  );
};

export default ChapterReader;
