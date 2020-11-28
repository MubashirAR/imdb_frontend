import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";

function Admin(props) {
  const [movies, setMovies] = useState([])
  const [editMode, setEditMode] = useState({})
  const [editData, setEditData] = useState({})
  const [page, setPage] = useState(1)
  const { authTokens } = useAuth()
  useEffect(() => {
    getAllMovies();
  }, [0]);

  const getAllMovies = async () => {
    let {data: movies} = await axios.get('/movies/all')
    console.log({movies})
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
    const resp = await axios.put('/movie/', movie, {
      headers: {
        'Authorization': ` ${token_type} ${access_token}`
      }
    });
    console.log({resp})
  }
  
  const changePage = jumpSize => {
    if(jumpSize < 0 && page == 1) return;
    if(jumpSize > 0 && movies.length < 10) return;
    setPage(page + jumpSize)
  }
  return (
    <div className="row">
      {movies.map(movie => (
          <div key={movie.id} className="col-sm-6">
            <div className="card">
              <div className="card-body">
                {
                  editMode[movie.id] 
                    ? (
                      <>
                        <input className="card-title" value={editData[movie.id].name}/>
                        <input className="card-title" value={editData[movie.id].director}/>
                        <input className="card-title" value={editData[movie.id].imdb_score}/>
                        <input className="card-title" value={editData[movie.id].popularity}/>
                        {movie.genres.map(genre => {
                          return <a className="badge badge-dark">{genre.name}</a>
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