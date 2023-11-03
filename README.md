# Blog Analytics with Express and Lodash(SubSpace Assignment)
You are developing a blog analytics and search tool using Express.js and Lodash. Your goal is to create a middle ware that analyzes the data retrieved from a third-party blog API (provided via the given curl request) and provides insightful statistics to clients. Additionally, you need to implement a blog search endpoint.

1. **Data Retrieval**:

   - Use Express to create a route at `/api/blog-stats`.

   - When a GET request is made to this route, your middleware should make the provided curl request to fetch the blog data.

curl --request GET \
  --url https://intent-kit-16.hasura.app/api/rest/blogs \
  --header 'x-hasura-admin-secret: 32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'

2. **Data Analysis**:

   - After fetching the data, use Lodash to perform the following analytics:

     - Calculate the total number of blogs fetched.

     - Find the blog with the longest title.

     - Determine the number of blogs with titles containing the word "privacy."

     - Create an array of unique blog titles (no duplicates).

3. **Response**:

   - Respond to the client with a JSON object containing the following statistics:

     - Total number of blogs.

     - The title of the longest blog.

     - Number of blogs with "privacy" in the title.

     - An array of unique blog titles.

4. **Blog Search Endpoint**:

   - Create an additional route at `/api/blog-search`.

   - This route should accept a query parameter, e.g., `/api/blog-search?query=privacy`.

   - Implement a search functionality that filters the blogs based on the provided query string (case-insensitive).

   - Ensure that the search functionality is an original implementation, and copied code from external sources is not allowed.

5. **Error Handling**:

   - Handle any errors that may occur during the data retrieval, analysis, or search process. If the third-party API is unavailable or returns an error, respond with an appropriate error message.

   - Error handling should be implemented without direct copying of code from external sources.

6. **Bonus Challenge**:

   - Implement a caching mechanism using Lodash's `memoize` function to store the analytics results and search results for a certain period. If the same requests are made within the caching period, return the cached results instead of re-fetching and re-analyzing the data.

   - Ensure that the caching mechanism is implemented as an original solution.
