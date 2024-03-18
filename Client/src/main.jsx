import React, {useState, createContext} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
export const UserContext = createContext()

const Root = () => {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <App />
    </UserContext.Provider>
  );
};


ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Root />
  </>,
)



