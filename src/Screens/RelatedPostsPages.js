import RelatedPosts from '../Components/RelatedPosts';

function TagRelatedPosts() {
    return <RelatedPosts type="tag" apiEndpoint="search-tag-posts" queryParam="tag" />;
}

function CategoryRelatedPosts() {
    return <RelatedPosts type="category" apiEndpoint="get-posts-by-category" queryParam="category" />;
}

function PopularPosts() {
    return <RelatedPosts type="popular" apiEndpoint="get-trending-posts" queryParam="" />;
}

export { TagRelatedPosts, CategoryRelatedPosts, PopularPosts};
