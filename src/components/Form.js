import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'https://webpagescrapper.onrender.com' 


export default function Form() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState([]);
  const [showAllData, setShowAllData] = useState(false);
  const [loading, setLoading] = useState(false);


  //handling the url post submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    //set loading message to true while the data is being extracted
    setLoading(true);

    //calling the getinfo api to extract the necessary data
    try {
      console.log(`${BASE_URL}/api/getinfo/`);
      const response = await axios.post(`${BASE_URL}/api/getinfo/`, { url });
      console.log(response.data);
      setData([response.data]); // Wrap the response data in an array
    } catch (error) {
      console.error(error);
    }

    //set loading message to false while the data is being extracted
    setLoading(false);
  };

  useEffect(() => {
    fetchTableData();
  }, []);


  //funstion to display the data
  const fetchTableData = async () => {
    setLoading(true);
    //calling the display api to display the necessary data
    try {
      const response = await axios.get(`${BASE_URL}/api/display/`);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  //function to handle the viewMore button
  const toggleShowAllData = () => {
    setShowAllData((prevState) => !prevState);
  };


  //function to mark a domain as favorite
  const markAsFavorite = async (itemId) => {
    try {
      //call the markasfav api to set the necessary value
      await axios.post(`${BASE_URL}/api/updatefav/markasfav`, { id: itemId });
      
      // Update the 'favorite' field in the local state
      setData((prevData) =>
        prevData.map((item) => {
          if (item._id === itemId) {
            return {
              ...item,
              favorite: true,
            };
          }
          return item;
        })
      );
      //after the marking of favourite, the updated data isfetched once again
      fetchTableData();
    } catch (error) {
      console.error(error);
    }
  };

  //function to remove a domain from favorites
  const RemoveAsFavorite = async (itemId) => {
    try {
      //call the removeasfav api to set the necessary value
      await axios.post(`${BASE_URL}/api/updatefav/removeasfav`, { id: itemId });
      
      // Update the 'favorite' field in the local state
      setData((prevData) =>
        prevData.map((item) => {
          if (item._id === itemId) {
            return {
              ...item,
              favorite: false,
            };
          }
          return item;
        })
      );
      //after the removing as favourite, the updated data isfetched once again
      fetchTableData();
    } catch (error) {
      console.error(error);
    }
  };

  //function to delete a domain data using its id
  const deleteDomain = async (itemId) => {
    try {
      console.log(itemId)
      //call the delete api to set the necessary value
      await axios.delete(`${BASE_URL}/api/deletedomain/delete/${itemId}`);
      // Remove the deleted item from the local state
      setData((prevData) => prevData.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className='form-container'>
        <h1>Web Page Scraper</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            required
          />
          <div className='submit-btn'>
            <button type="submit">GET INSIGHTS</button>
          </div>
        </form>
      </div>

      <div className='table-container'>
        <h2>SEARCH HISTORY</h2>
        {/* loading is displayed when data is being updated or fetched */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Favorite</th>
                <th>Word Count</th>
                <th>Media Links</th>
                <th>Web Links</th>
                <th>Favorite</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* data is displayed in the reverse format to show the recent searches at the top */}
              {[...data].reverse().map((item) => (
                <tr key={item._id}>
                  <td>{item.url}</td>
                  <td>{item.favorite ? 'Yes' : 'No'}</td>
                  <td>{item.wordCount}</td>
                  <td>{showAllData ? item.mediaLinks.join(', ') : item.mediaLinks.slice(0, 3).join(', ')}</td>
                  <td>{showAllData ? item.webLinks.join(', ') : item.webLinks.slice(0, 3).join(', ')}</td>
                  <td>

                    {/* The Button changes its text based on the value of favourite on the domain(true or false) */}
                    {item.favorite ? (
                      <button onClick={() => RemoveAsFavorite(item._id)}>REMOVE</button>
                    ) : (
                      <button onClick={() => markAsFavorite(item._id)}>FAVOURITE</button>
                    )}
                  </td>

                  {/* delete button which sends the id of item or domain as a arguement */}
                  <td>
                    <button onClick={() => deleteDomain(item._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* view more buttn which shows entire data which is initially hidden  */}
        <button onClick={toggleShowAllData}>
          {showAllData ? 'Show Less' : 'View More'}
        </button>
      </div>
    </div>
  );
}
