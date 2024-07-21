import React, { useEffect, useState } from "react";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import * as Cookies from "es-cookie";
import BASE_URL from "../Config/Config";
import axios from "axios";
import { useAuth } from "../context/auth";
import "./Pagination.css";
import { toast } from "react-toastify";

const PaginationExample = ({ e }) => {
  const { data, itemsPerPage } = e;
  const { category, numberOfRecords } = e;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [auth, setAuth] = useAuth();
  const token = Cookies.get("token");
  const totalPages = Math.ceil(category.length / numberOfRecords);
  const email = auth?.email;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const selectionsRes = await axios.get(`${BASE_URL}/user-selections`, {
          params: { email },
          headers: { Authorization: token },
        });
        setSelectedItems(selectionsRes.data.selectedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    if (token) {
      fetchItems();
    }
  }, [email, token]);

  useEffect(() => {
    async function saveSelections() {
      try {
        await axios.post(
          `${BASE_URL}/save-selections`,
          { email, selectedItems },
          {
            headers: { Authorization: token },
          }
        );
        toast.success("Selection saved successfully");
        // alert("Selections saved successfully");
      } catch (error) {
        toast.error("Error saving selections");
        console.error("Error saving selections:", error);
      }
    }
    if (selectedItems.length > 0) saveSelections();
  }, [selectedItems]);
  const handleItemChange = async (itemid) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(itemid)
        ? prevSelectedItems.filter((id) => id !== itemid)
        : [...prevSelectedItems, itemid]
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const maxVisiblePages = 7;
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push("...");
        }
      }
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  const startIndex = (currentPage - 1) * numberOfRecords;
  const endIndex = startIndex + numberOfRecords;
  const currentData = category.slice(startIndex, endIndex);

  return (
    <div className="category-data">
      <ul>
        {currentData.map((item) => (
          <li key={item.itemid}>
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.itemid)}
                onChange={() => handleItemChange(item.itemid)}
              />
              <span className="checkmark"></span>
              {item.itemname}
            </label>
          </li>
        ))}
      </ul>
      {/* <button onClick={handleSaveSelections}>Save Selections</button> */}
      <div className="page">
        <KeyboardDoubleArrowLeftIcon
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {pages.map((page, index) => (
          <a
            key={index}
            id={page}
            style={{
              margin: "0px 4px",
              fontWeight: currentPage === page ? "bold" : "normal",
              cursor: page === "..." ? "default" : "pointer",
              pointerEvents: page === "..." ? "none" : "auto",
            }}
            onClick={() => page !== "..." && handlePageChange(page)}
          >
            {page}
          </a>
        ))}
        <KeyboardDoubleArrowRightIcon
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </div>
    </div>
  );
};

export default PaginationExample;

//import React, { useEffect, useState } from "react";
// import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
// import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
// import * as Cookies from "es-cookie";
// import BASE_URL from "../Config/Config";
// import axios from "axios";
// import { useAuth } from "../context/auth";

// const PaginationExample = ({ e }) => {
//   const { data, itemsPerPage } = e;
//   const { category, numberOfRecords } = e;
//   // console.log(category);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedItems, setSelectedItems] = useState([]); //*************** */
//   const [auth, setAuth] = useAuth();
//   const token = Cookies.get("token");

//   const totalPages = Math.ceil(category.length / numberOfRecords);

//   // Slice data based on current page and items per page
//   const startIndex = (currentPage - 1) * numberOfRecords;
//   const endIndex = startIndex + numberOfRecords;
//   const currentData = category.slice(startIndex, endIndex);

//   // Handle page change
//   const email = auth?.email;

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         // const res = await axios.get(`${BASE_URL}/items`, {
//         //   headers: { Authorization: `Bearer ${token}` },
//         // });
//         // setItems(res.data.items);

//         const selectionsRes = await axios.get(`${BASE_URL}/user-selections`, {
//           params: { email },
//           headers: { Authorization: token },
//         });
//         setSelectedItems(selectionsRes.data.selectedItems);
//       } catch (error) {
//         console.error("Error fetching items:", error);
//       }
//     };

//     if (token) {
//       fetchItems();
//     }
//   }, []);

//   const handleItemChange = (itemid) => {
//     setSelectedItems((prevSelectedItems) =>
//       prevSelectedItems.includes(itemid)
//         ? prevSelectedItems.filter((id) => id !== itemid)
//         : [...prevSelectedItems, itemid]
//     );
//   };

//   const handleSaveSelections = async () => {
//     try {
//       await axios.post(
//         `${BASE_URL}/save-selections`,
//         { email, selectedItems },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       alert("Selections saved successfully");
//     } catch (error) {
//       console.error("Error saving selections:", error);
//     }
//   };

//   // ****************************************

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };
//   const maxVisiblePages = 7;

//   const getPageNumbers = () => {
//     // ****************************************************************************************

//     const pages = [];

//     if (totalPages <= maxVisiblePages) {
//       // Show all pages if total pages are less than or equal to maxVisiblePages
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       const startPage = Math.max(
//         1,
//         currentPage - Math.floor(maxVisiblePages / 2)
//       );
//       const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//       // Add leading dots if the startPage is greater than 1
//       if (startPage > 1) {
//         pages.push(1);
//         if (startPage > 2) {
//           pages.push("...");
//         }
//       }

//       // Add the visible page numbers
//       for (let i = startPage; i <= endPage; i++) {
//         pages.push(i);
//       }

//       // Add trailing dots if the endPage is less than totalPages
//       if (endPage < totalPages) {
//         if (endPage < totalPages - 1) {
//           pages.push("...");
//         }
//         pages.push(totalPages);
//       }
//     }

//     return pages;
//   };

//   const pages = getPageNumbers();

//   // *****************************************************************************

//   // console.log(data);
//   // console.log(itemsPerPage);
//   // Calculate total number of pages
//   console.log(category.length);

//   return (
//     <div>
//       <ul>
//         {currentData.map((item) => (
//           <li key={item.itemid}>
//             <label>
//               <input
//                 type="checkbox"
//                 checked={selectedItems.includes(item.itemid)}
//                 onChange={() => handleItemChange(item.itemid)}
//               />
//               {item.itemname}
//             </label>
//           </li>
//         ))}
//       </ul>
//       <button onClick={handleSaveSelections}>Save Selections</button>
//       {/* {currentData.map((item, index) => {
//         return (
//           <div className="check">
//             <input type="checkbox" style={{ width: "17px" }} />
//             <label htmlFor="" style={{ lineHeight: "28px", fontSize: "14px" }}>
//               {item.itemname}
//             </label>
//           </div>
//         );
//       })} */}
//       {/* Pagination controls */}

//       <div className="page">
//         <KeyboardDoubleArrowLeftIcon
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//         />
//         {pages.map((page, index) => (
//           <a
//             key={index}
//             id={page}
//             style={{
//               fontWeight: currentPage === page ? "bold" : "normal",
//               cursor: page === "..." ? "default" : "pointer",
//               pointerEvents: page === "..." ? "none" : "auto",
//             }}
//             onClick={() => page !== "..." && handlePageChange(page)}
//           >
//             {page}
//           </a>
//         ))}
//         <KeyboardDoubleArrowRightIcon
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         />
//       </div>
//     </div>
//   );
// };

// export default PaginationExample;
