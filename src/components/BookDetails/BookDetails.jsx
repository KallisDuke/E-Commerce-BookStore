import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Loading from "../Loader/Loader";
import coverImg from "../../images/cover_not_found.jpg";
import "./BookDetails.css";
import {FaArrowLeft} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const BookDetails = () => {
  const {id} = useParams();
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    async function getBookDetails(){
      try{
        const response = await fetch(`https://d1krvzwx5oquy1.cloudfront.net/books.json`);
        const data = await response.json();
        if(data){

         for(let key in data){
          if(key === id){
           const {volumeInfo, accessInfo} = data[key-1] ;
            const newBook = {
            description: volumeInfo.description ? volumeInfo.description: "Description not Available",
            title: volumeInfo.title,
            cover_img: volumeInfo.imageLinks === undefined ? coverImg :volumeInfo.imageLinks.smallThumbnail ,
            page_count: volumeInfo.pageCount,
            language : volumeInfo.language === "en" ? "English" : "Not Available in English",
            pdf : accessInfo.pdf.isAvailable ? "PDF is Available" : "PDF is Not Available"
          };
          setBook(newBook);
        }
        }
        } else {
          setBook(null);
        }
        setLoading(false);
      } catch(error){
        console.log(error);
        setLoading(false);
      }
    }
    getBookDetails();
  }, [id]);

  if(loading) return <Loading />;

  return (
    <section className='book-details'>
      <div className='container'>
        <button type='button' className='flex flex-c back-btn' onClick={() => navigate("/book")}>
          <FaArrowLeft size = {22} />
          <span className='fs-18 fw-6'>Go Back</span>
        </button>

        <div className='book-details-content grid'>
          <div className='book-details-img'>
            <img src = {book?.cover_img} alt = "cover img" />
          </div>
          <div className='book-details-info'>
            <div className='book-details-item title'>
              <span className='fw-6 fs-24'>{book?.title}</span>
            </div>
            <div className='book-details-item description'>
              <span>{book?.description}</span>
            </div>
            <div className='book-details-item'>
              <span className='fw-6'>Pages: </span>
              <span className='text-italic'>{book?.page_count}</span>
            </div>
            <div className='book-details-item'>
              <span className='fw-6'>Language: </span>
              <span className='text-italic'>{book?.language}</span>
            </div>
            <div className='book-details-item'>
              <span className='fw-6'>pdf: </span>
              <span>{book?.pdf}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookDetails