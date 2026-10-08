import {Navigate,Route,Routes} from 'react-router-dom';
import {useStore} from './store.jsx';import {Layout} from './ui.jsx';
import Auth from './pages/Auth.jsx';import Home from './pages/Home.jsx';import Wardrobe from './pages/Wardrobe.jsx';import CreateOutfit from './pages/CreateOutfit.jsx';
import Occasions from './pages/Occasions.jsx';import Recommendations from './pages/Recommendations.jsx';import SavedLooks from './pages/SavedLooks.jsx';import Shopping from './pages/Shopping.jsx';import Profile from './pages/Profile.jsx';
import FashionAssistant from './pages/FashionAssistant.jsx';import Payment from './pages/Payment.jsx';
const Guard=({children})=>useStore().authed?children:<Navigate to="/login" replace/>;
export default function App(){const {authed}=useStore();
 return <Routes><Route path="/" element={<Navigate to={authed?'/home':'/login'} replace/>}/>
  <Route path="/login" element={<Auth mode="login"/>}/><Route path="/register" element={<Auth mode="register"/>}/>
  <Route element={<Guard><Layout/></Guard>}><Route path="/home" element={<Home/>}/><Route path="/wardrobe" element={<Wardrobe/>}/><Route path="/create-outfit" element={<CreateOutfit/>}/><Route path="/occasions" element={<Occasions/>}/><Route path="/fashion-assistant" element={<FashionAssistant/>}/><Route path="/recommendations" element={<Recommendations/>}/><Route path="/saved-looks" element={<SavedLooks/>}/><Route path="/shopping" element={<Shopping/>}/><Route path="/payment" element={<Payment/>}/><Route path="/profile" element={<Profile/>}/></Route>
  <Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
