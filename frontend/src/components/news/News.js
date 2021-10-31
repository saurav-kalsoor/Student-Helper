import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

export default function News(props) {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [category, setCategory] = useState('general')

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const update = async (new_category) => {
        const URL = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${new_category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`
        setLoading(true);
        let promise = await fetch(URL);
        let data = await promise.json();
        setArticles(data.articles);
        setTotalResults(data.totalResults);
        setLoading(false);
        console.log(articles)
    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(category)} - NewsMonkey`;
        update(category)
        // eslint-disable-next-line
    }, [])

    const fetchMoreData = async () => {
        const URL = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`
        setPage(page + 1) // takes time to resolve thats why pushed down
        let promise = await fetch(URL);
        let data = await promise.json();
        setArticles(articles.concat(data.articles));
        setTotalResults(data.totalResults);
    }

    const handleClick = (e) => {
        setCategory(e.target.name)
        setCategory((state) => {
            update(state)
            return state;
        });
        
    }

    return (
        <>
            <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }} >NewsMonkey - Top {capitalizeFirstLetter(category)} Headlines</h1>
            {loading && <Spinner />}

            <div className="text-center my-5">
                <button name="general" type="button" className={`mx-2 text-center border btn ${category === 'general' ? "btn-primary" : "btn"}`} onClick={handleClick}>General</button>
                <button name="business" type="button" className={`mx-2 text-center border btn ${category === 'business' ? "btn-primary" : "btn"}`} onClick={handleClick}>Business</button>
                <button name="entertainment" type="button" className={`mx-2 text-center border btn ${category === 'entertainment' ? "btn-primary" : "btn"}`} onClick={handleClick}>Entertainment</button>
                <button name="health" type="button" className={`mx-2 text-center border btn ${category === 'health' ? "btn-primary" : "btn"}`} onClick={handleClick}>Health</button>
                <button name="science" type="button" className={`mx-2 text-center border btn ${category === 'science' ? "btn-primary" : "btn"}`} onClick={handleClick}>Science</button>
                <button name="technology" type="button" className={`mx-2 text-center border btn ${category === 'technology' ? "btn-primary" : "btn"}`} onClick={handleClick}>Technology</button>
                <button name="sports" type="button" className={`mx-2 text-center border btn ${category === 'sports' ? "btn-primary" : "btn"}`} onClick={handleClick}>Sports</button>
            </div>

            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length !== totalResults}
                loader={<Spinner />}
            >
                <div className="container">
                    <div className="row my-3">
                        {articles.map((element) => {
                            return <div key={element.url} className="col-md-4">
                                <NewsItem title={element.title} description={element.description} newsUrl={element.url} imageUrl={element.urlToImage} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    )
}

News.defaultProps = {
    country: 'in',
    pageSize: 6
}
News.propsTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number
}