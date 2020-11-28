import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import CONSTANTS from "../constants";

function Admin(props) {
  const [movies, setMovies] = useState([])
  const [editMode, setEditMode] = useState({})
  const [editData, setEditData] = useState({})
  const [page, setPage] = useState(1)
  const [deleteCount, setdeleteCount] = useState(1)
  const { authTokens } = useAuth()
  useEffect(() => {
    getAllMovies();
  }, [0]);
  useEffect(() => {
    getAllMovies();
  }, [page, deleteCount])
  const getAllMovies = async () => {
    let {data: movies} = await axios.get(CONSTANTS.path + `/movies/all?page=${page}`)
    setMovies(movies)
    let editData = {}
    movies.map(movie => {
      editData[movie.id] = movie;
    })
    setEditData(editData)
  }
  const toggleEditMode = movie => {
    setEditMode({
      ...editMode,
      [movie.id]: !editMode[movie.id]
    })
  };
  const updateMovie = async movie => {
    const { token_type, access_token } = authTokens || {};
    const resp = await axios.put(CONSTANTS.path + '/movie/', movie, {
      headers: {
        'Authorization': ` ${token_type} ${access_token}`
      }
    });
    alert('Changes saved successfully!')
    console.log({resp})
  }
  const deleteMovie = async movie => {
    if(!window.confirm(`Are you sure you want to delete the movie ${movie.name}`)) return;
    const { token_type, access_token } = authTokens || {};
    const resp = await axios.delete(CONSTANTS.path + `/movie/?id=${movie.id}`, {
      headers: {
        'Authorization': ` ${token_type} ${access_token}`
      }
    });
    setdeleteCount(deleteCount+1);
    alert('Movie deleted.')
  }
  const changeHandler = (movieIndex, key, genreIndex) => e => {
    const { value } = e.target;
    const newMovies = [...movies]
    const movie = newMovies[movieIndex]
    if(key === 'genre' && !isNaN(genreIndex)) {
      let genres = [...movie.genres]
      genres[genreIndex].name = value;
      movie.genres = genres
      setMovies(newMovies)
      return;
    }
    newMovies[movieIndex][key] = value
    setMovies(newMovies)
  }
  
  const changePage = jumpSize => {
    if(jumpSize < 0 && page == 1) return;
    if(jumpSize > 0 && movies.length < 10) return;
    setPage(page + jumpSize)
  }
  return (
    <div className="row">
      {movies.map((movie, index) => (
          <div key={movie.id} className="col-sm-6">
            <div className="card">
              <div className="card-body">
                {
                  editMode[movie.id] 
                    ? (
                      <>
                        <input className="card-title" onChange={changeHandler(index, 'name')} value={editData[movie.id].name}/>
                        <input className="card-title" onChange={changeHandler(index, 'director')} value={editData[movie.id].director}/>
                        <input className="card-title" onChange={changeHandler(index, 'imdb_score')} value={editData[movie.id].imdb_score}/>
                        <input className="card-title" onChange={changeHandler(index, 'popularity')} value={editData[movie.id].popularity}/>
                        {movie.genres.map((genre, genreIndex) => {
                          return <input className="card-title" onChange={changeHandler(index, 'popularity', genreIndex)} value={genre.name}/>
                        })}
                        <div>
                          <button className="btn btn-danger pull-right" onClick={_ => toggleEditMode(movie)}>Cancel</button>
                          <button className="btn btn-primary pull-right" onClick={_ => updateMovie(movie)}>Save</button>
                        </div>
                      </>
                    )
                    : (
                      <>
                        <h5 className="card-title">{movie.name}</h5>
                        <p className="card-text">{movie.director}</p>
                        {movie.genres.map(genre => {
                          console.log({genre})
                          return <a className="badge badge-dark">{genre.name}</a>
                        })}
                        <a href="#" className="badge badge-primary">IMDB Score: {movie.imdb_score}</a>
                        <div>
                          <button className="btn btn-primary pull-right" onClick={_ => toggleEditMode(movie)}>Edit</button>
                          <button className="btn btn-danger pull-right" onClick={_ => deleteMovie(movie)}>Delete</button>
                        </div>
                      </>
                    )
                }
                
              </div>
            </div>
          </div>
      ))}
      
      <div className="d-flex justify-content-center full-width w-100 p-3">
        {
          page > 1
          ?  <button className="btn btn-secondary mr-3" onClick={_ => changePage(-1)}>Prev</button>
          : null
        }
        page {page}
        {
          movies.length === 10
          ? <button className="btn btn-secondary ml-3" onClick={_ => changePage(1)}>Next</button>
          : null
        }
      </div>
    </div>
  );
}

export default Admin;