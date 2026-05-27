import React, { createContext, useContext, useEffect, useState } from "react";

const User = createContext();

const UserContext = ({ children }) => {
  const [from_loc, onChangeFrom_loc] = useState();
  const [to_loc, onChangeTo_loc] = useState();
  const [selectedDate, setSelectedDate] = useState();

  useEffect(() => {}, []);
  return (
    <User.Provider
      value={{
        from_loc,
        onChangeFrom_loc,
        to_loc,
        onChangeTo_loc,
        selectedDate,
        setSelectedDate,
      }}
    >
      {children}
    </User.Provider>
  );
};

export default UserContext;

export const UserState = () => {
  return useContext(User);
};

// import React, { createContext, useContext, useState } from "react";

// // Create a context
// const UserContext = createContext();

// // Create a provider component
// export const UserProvider = ({ children }) => {
//     const [from_loc, setFromLoc] = useState("");
//     const [to_loc, setToLoc] = useState("");
//     const [selectedDate, setSelectedDate] = useState("");

//     return (
//         <UserContext.Provider value={{
//             from_loc, setFromLoc,
//             to_loc, setToLoc,
//             selectedDate, setSelectedDate
//         }}>
//             {children}
//         </UserContext.Provider>
//     );
// };

// // ✅ Correctly Exported Hook
// export const useUserState = () => {
//     const context = useContext(UserContext);
//     if (!context) {
//         throw new Error("useUserState must be used within a UserProvider");
//     }
//     return context;
// };

// import React, { createContext, useContext, useState } from "react";

// // Create a context
// const UserContext = createContext();

// // Create a provider component
// export const UserProvider = ({ children }) => {
//     const [from_loc, setFromLoc] = useState(""); // ✅ Use setFromLoc
//     const [to_loc, setToLoc] = useState(""); // ✅ Use setToLoc
//     const [selectedDate, setSelectedDate] = useState("");

//     return (
//         <UserContext.Provider value={{
//             from_loc, setFromLoc,  // ✅ Corrected function names
//             to_loc, setToLoc,
//             selectedDate, setSelectedDate
//         }}>
//             {children}
//         </UserContext.Provider>
//     );
// };

// // ✅ Custom Hook for Context Usage
// export const useUserState = () => {
//     const context = useContext(UserContext);
//     if (!context) {
//         throw new Error("useUserState must be used within a UserProvider");
//     }
//     return context;
// };
