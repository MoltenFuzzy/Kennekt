import { useState } from "react";
import { IoCreate } from "react-icons/io5";
import PostForm from "./PostForm";
import { AiFillCloseCircle } from "react-icons/ai";
import "animate.css";

function PostFormModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center rounded-full bg-[#007EFB] py-2 px-2 transition duration-300 ease-in-out hover:opacity-80"
      >
        <IoCreate color="white" size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bottom-60 z-50 flex items-center justify-center">
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black opacity-30"
          />
          <div className="animate__animated animate__fadeInDown animate__faster  max-h-[600px] w-[80%] max-w-[800px] rounded-lg bg-white shadow-lg dark:bg-gray-800">
            <div className="mb-2 mt-2 mr-2 flex justify-end">
              <button onClick={() => setIsOpen(false)}>
                <AiFillCloseCircle color="red" size={25} />
              </button>
            </div>
            <div className="px-3">
              {/* Close Modal if the Mutation/Post is successfully created */}
              <PostForm onSuccess={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostFormModal;
