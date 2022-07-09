import React, { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Hearder from './components/Hearder';

export default () => {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);
  
  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }
    
    window.addEventListener('scroll', scrollListener);
    
    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);

  const loadAll = async () => {
    if(featuredData === null && movieList.length <= 0) {
      let list = await Tmdb.getHomeList();
    
      let originals = list.filter(item => item.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
      
      setMovieList(list);
    }
  }

  return (
    <div className='page'>

      <Hearder black={blackHeader}/>

      {featuredData &&
        <FeaturedMovie item={featuredData}/>
      }

      <section className='lists'>
        {movieList.map((item, index) => (
          <MovieRow key={index} title={item.title} items={item.items}/>
        ))}
      </section>

      <footer>
        Feito com <span role='img' aria-label='coração'>❤️</span> por ZacCompany<br/>
        Direitos de imagem para Netflix<br/>
        Dados pegos do site Themoviedb.org
      </footer>

      {movieList.length <= 0 &&
        <div className='loading'>
          <img src='https://i.gifer.com/origin/36/36527397c208b977fa3ef21f68c0f7b2.gif' alt='Carregando' />
        </div>
      }
    </div>

  )
}