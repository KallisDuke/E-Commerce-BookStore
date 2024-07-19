import React, { useState, useContext, useEffect } from "react";
import { useCallback } from "react";
import coverImg from "./images/cover_not_found.jpg";
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultTitle, setResultTitle] = useState("");

  const priceArr = [
    "24$",
    "30$",
    "66$",
    "120$",
    "10$",
    "99$",
    "67$",
    "11$",
    "20$",
  ];
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://freetestapi.com/api/v1/books`);
      const data = await response.json();
      //console.log(data);
      if (data) {
        const searchData = data.filter((e) => {
          let title1 = e.title.toLowerCase();
          if (title1.includes(searchTerm.toLowerCase())) {
            return e;
          }
        });
        //console.log("SearchData", searchData);
        let newSearchBooks;
        if (searchData) {
          newSearchBooks = searchData.map((bookSingle) => {
            const { id, title, author, cover_image, publication_year } =
              bookSingle;
            return {
              id: id,
              author: author,
              cover_id:
                cover_image === undefined ? "Not Available" : cover_image,
              price: priceArr[Math.floor(Math.random() * priceArr.length)],
              first_publish_year: publication_year,
              title: title,
            };
          });
          setBooks(newSearchBooks);
        } else {
          const newBooks = data.map((bookSingle) => {
            const { id, title, author, cover_image, publication_year } =
              bookSingle;
            return {
              id: id,
              author: author,
              cover_id: cover_image === undefined ? cover_image : cover_image,
              price: "100$",
              first_publish_year: publication_year,
              title: title,
            };
          });
          setBooks(newBooks);
        }
        if (newSearchBooks.length >= 1) {
          setResultTitle("Your Search Result");
        } else {
          setResultTitle("No Search Result Found!");
        }
      } else {
        setBooks([]);
        setResultTitle("No Search Result Found!");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, fetchBooks]);

  return (
    <AppContext.Provider
      value={{
        loading,
        books,
        setSearchTerm,
        resultTitle,
        setResultTitle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
