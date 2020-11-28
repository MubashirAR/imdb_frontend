import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import { useHistory } from "react-router-dom";

const initialState = {
  name: '',
  director: '',
  imdb_score: 0,
  popularity: 0,
  genres: [{
    name: ''
  }]
}
function NewMovie(props) {
  const [movie, setMovie] = useState(initialState)
  const history = useHistory()
  const { authTokens } = useAuth()
  const saveMovie = async () => {
      if(!isFormValid()) {
        return;
      }
      movie.genre = movie.genres;
      const { token_type, access_token } = authTokens || {};
      try {
        const resp = await axios.post('/movie/', movie, {
          headers: {
              'Authorization': ` ${token_type} ${access_token}`
          }
        });
        if(resp.status === 201) {
          alert('Saved successfully')
          history.push('/')
        } else {
          alert('There was an error')
        }
      } catch (error) {
        alert('There was an error. Please make sure you are logged in as admin')
      }
  }
  const isFormValid = () => {
    if(!movie.name || !movie.director) {
      alert('Invalid details! Please fill all details')
      return false;
    }
    if(movie.imdb_score < 0 || movie.imdb_score > 10) {
      alert('IMDB score must be between 0 to 10')
      return false
    }
    if(movie.popularity < 0 || movie.popularity > 100) {
      alert('Popularity score must be between 0 to 100')
      return false
    }
    return true
  }
  const changeHandler = (key, index) => e => {
    const { value } = e.target;
    if(key === 'genre' && !isNaN(index)) {
      let genres = [...movie.genres]
      genres[index].name = value;
      setMovie({
        ...movie,
        genres,
        [key]: value
      })
      return;
    }
    setMovie({
      ...movie,
      [key]: value
    })
  }
  const addGenre = () => {
    const genres = [...movie.genres];
    genres.push({ name: '' })
    setMovie({
      ...movie,
      genres
    })
  }
  const removeGenre = (index) => {
    const genres = [...movie.genres];
    genres.splice(index,1);
    setMovie({
      ...movie,
      genres
    })
  }
  return (
      <div className="row">
          <div className="d-flex justify-content-center align-items-center w-100 p-5">
              <div className="card">
                <div className="card-body">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label className="input-group-text">movie name</label>
                  </div>
                  <input className="form-control" onChange={changeHandler('name')} value={movie.name}/>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label className="input-group-text">director</label>
                  </div>
                  <input className="form-control" onChange={changeHandler('director')} value={movie.director}/>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label className="input-group-text">popularity</label>
                  </div>
                  <input type="number" className="form-control" onChange={changeHandler('popularity')} value={movie.popularity}/>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label className="input-group-text">imdb score</label>
                  </div>
                  <input type="number" className="form-control" onChange={changeHandler('imdb_score')} value={movie.imdb_score}/>
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <label className="input-group-text">Genres</label>
                    </div>
                    <div className="d-flex flex-column">
                      {
                        movie.genres.map((genre, index) => 
                          <div>
                            <div class="input-group pr-1 pb-1">
                              <input type="text" className="form-control" onChange={changeHandler('genre', index)} value={genre.name}/>
                              {
                                movie.genres.length > 1 
                                ? <div class="input-group-append">
                                    <button className="btn btn-danger" onClick={_ => removeGenre(index)}>Remove</button>
                                  </div>
                                : null
                              }
                            </div>
                            
                          </div>
                        )
                      }
                    </div>
                      </div>
                      <button className="btn btn-secondary" onClick={addGenre}>+ Add Genre</button>
                  </div>
                  <button className="btn btn-primary pull-right" onClick={_ => saveMovie()}>Save</button>
                </div>
              </div>
          </div>
  );
}

export default NewMovie;