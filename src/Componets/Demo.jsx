import React from 'react'
import { useState, useEffect } from 'react';
import { copy, linkIcon, loader, tick} from '../assets';
import { useLazyGetSummaryQuery } from '../services/article';

const Demo = () => {
  const [article, setArticle] = useState({
    url: '',
    summary: '',
  })
const [allArticles, setAllArticles] = useState([]);

  const[getSummary, {error, isFetching}] = useLazyGetSummaryQuery();

  // newArticles to the storage 
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem('articles')
    )
    if(articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage)
    }
  }, []);//dependecy array 

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Fetch summary using rapiApi.com for summary api. 
    const { data } = await getSummary({ articleUrl: article.url });

    if(data?.summary) {
      const newArticle = { ...article, summary: data. summary};
      const updateAllArticles = [newArticle, ...allArticles];
      setArticle(newArticle);
      setAllArticles(updateAllArticles);
      localStorage.setItem('article', JSON.stringify (updateAllArticles));
    }
  }

  return (
    <section children='mt-16 w-full max-w-xl'>
      {/* Search */}
      <div className='flex flex-col w-full gap-2'>
        <form 
          className='relative flex justify-center items-center' 
          onSubmit={handleSubmit} 
        >
          <img 
            src={linkIcon} 
            alt='link_icon'
            className='absolute left-0 my-2 ml-3 w-5' 
          />
          <input 
            type='url' 
            placeholder='Enter a Url' 
            value={article.url} 
            onChange={(e) => setArticle({ ...article, url: e.target.value })} 
            required 
            className='url_input peer'
          />
          <button
            type='submit'
            className='submit_btn 
            peer-focus:border-gray-700
            peer-focus:text-gray-700'
          >
            ✅
          </button>
        </form>
        {/* Browse URL History */}
        <div className='flex flex-col gap-1 max-h-60 overflow-y-auto' >
          {allArticles.map((item, index) => (
            <div
            key={`link-${index}`}
            onClick={() => setArticle(item)}
            className="link_card"
            >
              <div className='copy_btn'>
                <img 
                  src={copy}
                  alt="copy_icon"
                  className='w-40% h-[40%] object-contain'
                />
              </div>
              <p className='flex-1 font sotoshi text-red-700 font-medium text-sm truncate' >
                {item.url}
              </p>
              </div>
          ))}
        </div>
      </div>
      {/* display results */}
      <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching ? (
          <img src={loader} alt="loader" className='w-20 h-20 object-contain' />
        ) :error? (
          <p className='font-inter font-bold text-black text-center' >
            Well, that wasn't supposed to happen...
            < br/>
            <span className='font-satoshi font-normal text-gray-700' >
              {error?.datra?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className='flex flex-col gap-3' >
              <h2 className='font-satoshi font-bold text-gray-600 text-xl' >
                Article <span className='red_gradient'>Summary</span>
              </h2>
              <div>
                <p>{article.summary}</p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  )
}

export default Demo;