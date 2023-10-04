import express from 'express';
import fetch from 'node-fetch';
import _ from 'lodash';

const PORT=9000;
const app=express();


//fetch Url and fetch options
var URL='https://intent-kit-16.hasura.app/api/rest/blogs';
var fetchOptions={
    method:'GET',
    headers:{'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
             'content-type':'application/json'
             }
            }
//////////////////      Data Analysis    ////////////////////////////////////

//function for middleware
const fetchAndAnalyze=async(request)=>{
       try {
            /////////Data Retrieval///////////
            const response=await fetch(URL,fetchOptions)
            //while find error from third party api
            if(!response.ok)
            {
                throw new Error('Error occurred by Third Party API')
            }
            const data=await response.json()
            //Data Analysis
            //find size of retrieved data
            const sizeOfdata=_.size(data.blogs)
        
            //find longest title
            const LongestTitleBlog=_.maxBy(data.blogs,(blog)=>blog.title.length)
        
            //find number of blog with word 'privacy'
            const BlogWith_privacy_Title=_.filter(data.blogs,(blog)=>blog.title.toLowerCase().includes('privacy')) //Change Title to lowercase then check 'privacy' availbility
            const SizeofBlogWith_privacy_Title=_.size(BlogWith_privacy_Title)
        
            //find unique titles of the blog data
            const uniqueTitleBlog=_.uniq(data.blogs.map((blog)=>blog.title))
            return { 
                "Number of Blogs":sizeOfdata,   //Size of retrieved data
                "Longest Title":LongestTitleBlog.title,
                "Number of blogs title included 'privacy' word":SizeofBlogWith_privacy_Title,
                "Unique Titles of the blogs":uniqueTitleBlog         
            }    
       } catch (error) {
          throw new Error(`Error during data retrival: ${error.message}`)
       }
           
}
//Memoize function for middleware
const fetchAndAnalyzeMemoize=_.memoize(fetchAndAnalyze)

//Middleware
const middlewareFetchAnalyze=async(req,res,next)=>{
    try {
        const request=req.url;
    req.middlewareData=await fetchAndAnalyzeMemoize(request)
     next()
    } catch (error) {
        res.status(404).json({
            Success:false,
            Error:error.message
        })
    }
         
}

//route
app.get('/api/blog-stats',middlewareFetchAnalyze,async(req,res)=>{
    try {
       
        //import data from middleware 
        const Data=await req.middlewareData;
          console.log(Data)
        //if result has no content
        if(Object.keys(Data).length==0)
        {
            return res.status(200).json({
              Result:"No data found"
            }
            )
        }
       
        res.status(200).json(Data)
    } catch (error) {
        res.status(500).json({
            Success:false,
            message:`Something went wrong:${error.message}`
        })
    }
})

////////////////////Blog search endpoint 'api/blog-search'//////////////////////////

        //Define method to fetch and filter search results
        const fetchAndFilterSearch=(async(query)=>{ 
            try {
                   const response=await fetch(URL,fetchOptions);
                if(!response.ok)
                {
                throw new Error('Third party api fetching failed')
                }
               const data=await response.json();
               const filteredBlogswithQuery=_.filter(data.blogs,(blog)=>blog.title.toLowerCase().includes(query.toLowerCase()))
               return filteredBlogswithQuery;
            } catch (error) {
                throw error
            }
                 
                })
            
        //use memoize function to cache data
        const memoizefetchAndFilterSearch=_.memoize(fetchAndFilterSearch)

        //api
        app.get('/api/blog-search',async (req,res)=>{
            try {
                const query=req.query.query;
                if(!query)
                {
                    throw new Error('Please mention appropriate query')
                }
                //import memoize function 
                const searchResults=await memoizefetchAndFilterSearch(query);
                   
                //if result has no content
                if(searchResults.length==0)
                {
                    return res.status(200).json(
                        "No result found for the given query"
                    )
                }
               
                res.status(200).json({
                    Success:'Data found successfully',
                    Results:searchResults
                })
            } catch (error) {
                res.status(500).json({
                    Success:false,
                    message:`Something went wrong:${error.message}`
                })
            }
        })
        
   //Server Listening...
app.listen(PORT,()=>{
    console.log("Server is running at PORT:",PORT)
})