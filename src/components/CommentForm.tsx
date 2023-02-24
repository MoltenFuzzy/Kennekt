import React from "react";

function CommentForm() {
  return (
    <>
      <form>
        <div className="flex flex-col">
          <label htmlFor="comment" className="sr-only">
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 bg-black p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Join the discussion"
            defaultValue={""}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Post comment
          </button>
        </div>
      </form>
    </>
  );
}

export default CommentForm;
