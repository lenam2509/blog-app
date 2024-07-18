export const Tags = () => {
  return (
    <div className="bg-white shadow-lg border-2 border-gray-300 shadow-gray-400 p-4">
      <b className="text-lg">Tags</b>
      <div className="flex flex-wrap gap-2 mt-5">
        <button
          disabled
          className="bg-gray-500 text-white p-2 rounded disabled:bg-gray-400"
        >
          Python
        </button>
        <button className="bg-gray-500 text-white p-2 rounded">Django</button>
        <button className="bg-gray-500 text-white p-2 rounded">React</button>
        <button className="bg-gray-500 text-white p-2 rounded">Node</button>
        <button className="bg-gray-500 text-white p-2 rounded">Express</button>
        <button className="bg-gray-500 text-white p-2 rounded">MongoDB</button>
        <button className="bg-gray-500 text-white p-2 rounded">
          JavaScript
        </button>
        <button className="bg-gray-500 text-white p-2 rounded">
          TypeScript
        </button>
        <button className="bg-gray-500 text-white p-2 rounded">HTML</button>
        <button className="bg-gray-500 text-white p-2 rounded">CSS</button>
      </div>
    </div>
  );
};
