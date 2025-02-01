import './App.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Home from './Screens/Home.js'
import BlogEditor from './Screens/BlogEditor.js';
import SignIn from './Screens/SignIn.js';
import Signup from './Screens/SignUp.js';
import ReadPost from './Screens/ReadPost.js';
import Posts from './Screens/Posts.js';
import Profile from './Screens/Profile.js';
import { UserProvider } from './contexts/UserContextProvider.js'
import Notification from './Screens/Notification.js';
import NotFoundPage from './Screens/NotFoundPage.js';
import AboutUs from './Screens/AboutUs.js';
import Category from './Screens/Category.js';
import {TagRelatedPosts, CategoryRelatedPosts, PopularPosts} from './Screens/RelatedPostsPages.js';
import VerifyEmail from './Screens/VerifyEmail.js';

function App() {
  return (
    <UserProvider>
      <Router>
        <div>
          <ToastContainer />
          <Routes>
            <Route exact path='/' element={<Home />}></Route>
            <Route exact path='/posts' element={<Posts />}></Route>
            <Route exact path='/write' element={<BlogEditor />}></Route>
            <Route exact path='/signin' element={<SignIn />} />
            <Route exact path='/signup' element={<Signup />} />
            <Route exact path='/about' element={<AboutUs />} />
            <Route exact path='/categories' element={<Category />} />
            <Route exact path='/popular-posts' element={<PopularPosts />} />
            <Route exact path="/readpost/:postId/" element={<ReadPost />} />
            <Route exact path="/:userID/profile" element={<Profile />}/>
            <Route exact path="/verify-email" element={<VerifyEmail />} />
            <Route exact path="/user-notifications" element={<Notification />}/>
            <Route exact path="/tag/:tag/related-posts" element={<TagRelatedPosts />}/>
            <Route exact path="/category/:category/related-posts" element={<CategoryRelatedPosts />}/>
            <Route path="*" element={<NotFoundPage/>} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
