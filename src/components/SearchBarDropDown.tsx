import React, { useState } from "react";

interface UserSearchDropdownProps {
  userList: string[];
}

const UserSearchDropdown = ({ userList }: UserSearchDropdownProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUserList, setFilteredUserList] = useState<string[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUserList(
      userList.filter((user) => user.toLowerCase().includes(query))
    );
  };

  React.useEffect(() => {
    if (searchQuery === "") setFilteredUserList([]);
  }, [searchQuery]);

  return (
    <div className="relative w-1/3">
      <form className="hidden sm:flex" autoComplete="off">
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="basis-3/3 relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              aria-hidden="true"
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="simple-search"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-1.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleInputChange}
            required
          />
        </div>
      </form>
      <div>
        <ul className="absolute mt-1 hidden w-full overflow-hidden rounded dark:text-white sm:flex sm:flex-col">
          {filteredUserList.map((user, index) => (
            <li
              key={index}
              className="cursor-pointer bg-zinc-700 p-2 hover:bg-slate-900"
            >
              {user}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserSearchDropdown;
