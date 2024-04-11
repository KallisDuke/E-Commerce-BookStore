import React, {useState, useContext, useEffect} from 'react';
import { useCallback } from 'react';
import coverImg from "./images/cover_not_found.jpg";
const AppContext = React.createContext();

const AppProvider = ({children}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resultTitle, setResultTitle] = useState("");

    const fetchBooks = useCallback(async() => {
        setLoading(true);
        try{
            const response = await fetch(`https://d1krvzwx5oquy1.cloudfront.net/books.json`);
            const data = await response.json();
            if(searchTerm){
                var searchData = data.filter( e => {
                    let title1 = (e.volumeInfo.title).toLowerCase();
                    if((title1).includes(searchTerm.toLowerCase())){
                          return e;
                         }
                } );
            }
            if(data){
                if(searchData){
                    var newSearchBooks = searchData.map((bookSingle) => {
                        const { id, volumeInfo , saleInfo} = bookSingle;
                        return {
                            id: id,
                            author: volumeInfo.authors.join(", "),
                            cover_id: volumeInfo.imageLinks === undefined ? coverImg :volumeInfo.imageLinks.smallThumbnail ,
                            price: saleInfo.saleability === "FOR_SALE" ? saleInfo.listPrice.amount+"INR" : "Not for Sale"  ,
                            first_publish_year: volumeInfo.publishedDate,
                            title: volumeInfo.title 
                    }
                    });
                    setBooks(newSearchBooks);
                }
                else {
                    var newBooks = data.map((bookSingle) => {
                    const { id, volumeInfo , saleInfo} = bookSingle;
                    return {
                        id: id,
                        author: volumeInfo.authors.join(", "),
                        cover_id: volumeInfo.imageLinks === undefined ? coverImg :volumeInfo.imageLinks.smallThumbnail ,
                        price: saleInfo.saleability === "FOR_SALE" ? saleInfo.listPrice.amount+"INR" : "Not for Sale"  ,
                        first_publish_year: volumeInfo.publishedDate,
                        title: volumeInfo.title 
                }
                });         
                setBooks(newBooks);
            }
                if( newSearchBooks.length >= 1){
                    setResultTitle("Your Search Result");
                } else {
                    setResultTitle("No Search Result Found!")
                }
            } else {
                setBooks([]);
                setResultTitle("No Search Result Found!");
            }
            setLoading(false);
        } catch(error){
            console.log(error);
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        fetchBooks();
    }, [searchTerm, fetchBooks]);

    return (
        <AppContext.Provider value = {{
            loading, books, setSearchTerm, resultTitle, setResultTitle
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext);
}

export {AppContext, AppProvider};