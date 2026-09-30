// =====================================================
// STUDYMATE AI - COMPLETE FRONTEND JAVASCRIPT
// =====================================================
// FEATURES:
// 1. Register account
// 2. Save account permanently
// 3. Login after logout
// 4. Multiple user accounts
// 5. Automatic old-account migration
// 6. New Chat
// 7. Previous Chat History
// 8. Search Chats
// 9. Delete Chat
// 10. Clear Chat History
// 11. Gemini AI Backend
// 12. Auto Login after page refresh
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("🎓 StudyMate AI started");


    // =================================================
    // AUTH ELEMENTS
    // =================================================

    const authPage =
        document.getElementById("authPage");

    const chatApp =
        document.getElementById("chatApp");

    const registerBox =
        document.getElementById("registerBox");

    const loginBox =
        document.getElementById("loginBox");


    const registerName =
        document.getElementById("registerName");

    const registerEmail =
        document.getElementById("registerEmail");

    const registerPassword =
        document.getElementById("registerPassword");

    const registerBtn =
        document.getElementById("registerBtn");

    const registerError =
        document.getElementById("registerError");


    const loginEmail =
        document.getElementById("loginEmail");

    const loginPassword =
        document.getElementById("loginPassword");

    const loginBtn =
        document.getElementById("loginBtn");

    const loginError =
        document.getElementById("loginError");


    const showLoginBtn =
        document.getElementById("showLoginBtn");

    const showRegisterBtn =
        document.getElementById("showRegisterBtn");


    const studentName =
        document.getElementById("studentName");

    const logoutBtn =
        document.getElementById("logoutBtn");


    // =================================================
    // CHAT ELEMENTS
    // =================================================

    const chatForm =
        document.getElementById("chatForm");

    const messageInput =
        document.getElementById("messageInput");

    const messages =
        document.getElementById("messages");

    const typing =
        document.getElementById("typing");


    const newChatBtn =
        document.getElementById("newChatBtn");

    const chatList =
        document.getElementById("chatList");

    const searchInput =
        document.getElementById("searchInput");

    const clearBtn =
        document.getElementById("clearBtn");


    // =================================================
    // CHAT STATE
    // =================================================

    let currentChatId = null;

    let currentUserEmail = null;


    // =================================================
    // USER ACCOUNT STORAGE
    // =================================================
    //
    // New version:
    // studymateUsers
    //
    // Old version:
    // studymateUser
    //
    // The old account will automatically be migrated.
    // =================================================


    function getUsers() {

        try {

            // -----------------------------------------
            // CHECK NEW USER STORAGE
            // -----------------------------------------

            const savedUsers =
                localStorage.getItem(
                    "studymateUsers"
                );


            if (savedUsers) {

                const users =
                    JSON.parse(savedUsers);


                if (Array.isArray(users)) {

                    return users;

                }

            }


            // -----------------------------------------
            // MIGRATE OLD ACCOUNT
            // -----------------------------------------

            const oldUserData =
                localStorage.getItem(
                    "studymateUser"
                );


            if (oldUserData) {

                const oldUser =
                    JSON.parse(oldUserData);


                if (
                    oldUser &&
                    oldUser.email
                ) {

                    const migratedUsers =
                        [oldUser];


                    localStorage.setItem(
                        "studymateUsers",
                        JSON.stringify(
                            migratedUsers
                        )
                    );


                    console.log(
                        "✅ Old account migrated successfully."
                    );


                    return migratedUsers;

                }

            }

        }
        catch (error) {

            console.error(
                "❌ Error loading users:",
                error
            );

        }


        return [];

    }


    // =================================================
    // SAVE USERS
    // =================================================

    function saveUsers(users) {

        try {

            localStorage.setItem(
                "studymateUsers",
                JSON.stringify(users)
            );


            console.log(
                "✅ User accounts saved."
            );

        }
        catch (error) {

            console.error(
                "❌ Error saving users:",
                error
            );

        }

    }


    // =================================================
    // HISTORY STORAGE KEY
    // =================================================

    function getHistoryKey() {

        if (!currentUserEmail) {

            return "studymateChatHistory";

        }


        return (
            "studymateChatHistory_" +
            currentUserEmail
        );

    }


    // =================================================
    // GET SAVED CHATS
    // =================================================

    function getChats() {

        try {

            const saved =
                localStorage.getItem(
                    getHistoryKey()
                );


            if (!saved) {

                return [];

            }


            const chats =
                JSON.parse(saved);


            return Array.isArray(chats)
                ? chats
                : [];

        }
        catch (error) {

            console.error(
                "❌ Unable to load chat history:",
                error
            );


            return [];

        }

    }


    // =================================================
    // SAVE CHATS
    // =================================================

    function saveChats(chats) {

        try {

            localStorage.setItem(
                getHistoryKey(),
                JSON.stringify(chats)
            );

        }
        catch (error) {

            console.error(
                "❌ Unable to save chats:",
                error
            );

        }

    }


    // =================================================
    // CREATE CHAT ID
    // =================================================

    function createChatId() {

        return (
            "chat_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 8)
        );

    }


    // =================================================
    // CLEAR CHAT SCREEN
    // =================================================

    function clearChatScreen() {

        if (messages) {

            messages.innerHTML = "";

        }


        if (messageInput) {

            messageInput.value = "";

        }


        if (typing) {

            typing.classList.add(
                "hidden"
            );

        }

    }


    // =================================================
    // START NEW CHAT
    // =================================================

    function startNewChat() {

        console.log(
            "🆕 New Chat clicked"
        );


        // Create temporary chat ID
        currentChatId =
            createChatId();


        // Clear main chat area
        clearChatScreen();


        // Keep previous chats
        renderChatList();


        // Focus message box
        if (messageInput) {

            messageInput.focus();

        }


        console.log(
            "✅ Blank new chat ready"
        );

    }


    // =================================================
    // SAVE MESSAGE TO CURRENT CHAT
    // =================================================

    function saveMessageToCurrentChat(
        role,
        text
    ) {

        const chats =
            getChats();


        let chat =
            chats.find(
                item =>
                    item.id ===
                    currentChatId
            );


        // -----------------------------------------
        // CREATE CHAT IF IT DOES NOT EXIST
        // -----------------------------------------

        if (!chat) {

            chat = {

                id:
                    currentChatId ||
                    createChatId(),

                title:
                    "New Chat",

                messages:
                    [],

                createdAt:
                    new Date()
                        .toISOString(),

                updatedAt:
                    new Date()
                        .toISOString()

            };


            currentChatId =
                chat.id;


            chats.push(chat);

        }


        // -----------------------------------------
        // SAVE MESSAGE
        // -----------------------------------------

        chat.messages.push({

            role:
                role,

            text:
                text,

            time:
                new Date()
                    .toISOString()

        });


        // -----------------------------------------
        // CREATE TITLE FROM FIRST USER MESSAGE
        // -----------------------------------------

        if (
            role === "user" &&
            chat.title === "New Chat"
        ) {

            let title =
                text.trim();


            if (title.length > 35) {

                title =
                    title.substring(
                        0,
                        35
                    ) + "...";

            }


            chat.title =
                title;

        }


        // -----------------------------------------
        // UPDATE CHAT TIME
        // -----------------------------------------

        chat.updatedAt =
            new Date()
                .toISOString();


        // -----------------------------------------
        // SAVE TO LOCAL STORAGE
        // -----------------------------------------

        saveChats(chats);


        // Update sidebar
        renderChatList();

    }


    // =================================================
    // OPEN PREVIOUS CHAT
    // =================================================

    function openPreviousChat(
        chatId
    ) {

        console.log(
            "📂 Opening chat:",
            chatId
        );


        const chats =
            getChats();


        const chat =
            chats.find(
                item =>
                    item.id ===
                    chatId
            );


        if (!chat) {

            console.warn(
                "⚠️ Chat not found"
            );

            return;

        }


        // Set current chat
        currentChatId =
            chat.id;


        // Clear screen
        clearChatScreen();


        // Restore messages
        if (
            Array.isArray(
                chat.messages
            )
        ) {

            chat.messages.forEach(
                function (msg) {

                    addMessage(
                        msg.role,
                        msg.text
                    );

                }
            );

        }


        // Refresh sidebar
        renderChatList();


        if (messageInput) {

            messageInput.focus();

        }


        console.log(
            "✅ Previous chat restored:",
            chat.title
        );

    }


    // =================================================
    // DELETE CHAT
    // =================================================

    function deleteChat(
        chatId,
        event
    ) {

        if (event) {

            event.stopPropagation();

        }


        const confirmed =
            confirm(
                "Delete this chat?"
            );


        if (!confirmed) {

            return;

        }


        let chats =
            getChats();


        chats =
            chats.filter(
                chat =>
                    chat.id !==
                    chatId
            );


        saveChats(chats);


        // If current chat was deleted
        if (
            chatId ===
            currentChatId
        ) {

            currentChatId =
                createChatId();


            clearChatScreen();

        }


        renderChatList();


        console.log(
            "🗑 Chat deleted"
        );

    }


    // =================================================
    // RENDER RECENT CHATS
    // =================================================

    function renderChatList() {

        if (!chatList) {

            return;

        }


        const chats =
            getChats();


        chatList.innerHTML = "";


        // -----------------------------------------
        // SEARCH
        // -----------------------------------------

        const searchTerm =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        // -----------------------------------------
        // ONLY REAL CHATS
        // -----------------------------------------

        let filteredChats =
            chats.filter(
                chat =>
                    chat.messages &&
                    chat.messages.length > 0
            );


        // -----------------------------------------
        // SEARCH TITLE + MESSAGES
        // -----------------------------------------

        if (
            searchTerm !== ""
        ) {

            filteredChats =
                filteredChats.filter(
                    chat => {

                        const title =
                            (
                                chat.title ||
                                ""
                            )
                                .toLowerCase();


                        const messageText =
                            chat.messages
                                .map(
                                    msg =>
                                        msg.text ||
                                        ""
                                )
                                .join(" ")
                                .toLowerCase();


                        return (
                            title.includes(
                                searchTerm
                            ) ||
                            messageText.includes(
                                searchTerm
                            )
                        );

                    }
                );

        }


        // -----------------------------------------
        // NEWEST FIRST
        // -----------------------------------------

        filteredChats.sort(
            (a, b) =>
                new Date(
                    b.updatedAt
                ) -
                new Date(
                    a.updatedAt
                )
        );


        // -----------------------------------------
        // NO CHATS
        // -----------------------------------------

        if (
            filteredChats.length === 0
        ) {

            const empty =
                document.createElement(
                    "div"
                );


            empty.className =
                "empty-history";


            empty.textContent =
                searchTerm
                    ? "No matching chats"
                    : "No previous chats";


            chatList.appendChild(
                empty
            );


            return;

        }


        // -----------------------------------------
        // DISPLAY CHATS
        // -----------------------------------------

        filteredChats.forEach(
            function (chat) {

                const chatItem =
                    document.createElement(
                        "div"
                    );


                chatItem.className =
                    "previous-chat-item";


                // Active chat
                if (
                    chat.id ===
                    currentChatId
                ) {

                    chatItem.classList.add(
                        "active"
                    );

                }


                // ---------------------------------
                // CHAT TITLE
                // ---------------------------------

                const title =
                    document.createElement(
                        "span"
                    );


                title.className =
                    "previous-chat-title";


                title.textContent =
                    "💬 " +
                    (
                        chat.title ||
                        "Chat"
                    );


                // ---------------------------------
                // DELETE BUTTON
                // ---------------------------------

                const deleteBtn =
                    document.createElement(
                        "button"
                    );


                deleteBtn.className =
                    "delete-chat-btn";


                deleteBtn.type =
                    "button";


                deleteBtn.textContent =
                    "🗑️";


                deleteBtn.title =
                    "Delete chat";


                deleteBtn.addEventListener(
                    "click",
                    function (event) {

                        deleteChat(
                            chat.id,
                            event
                        );

                    }
                );


                // Add title
                chatItem.appendChild(
                    title
                );


                // Add delete button
                chatItem.appendChild(
                    deleteBtn
                );


                // ---------------------------------
                // OPEN CHAT
                // ---------------------------------

                chatItem.addEventListener(
                    "click",
                    function () {

                        openPreviousChat(
                            chat.id
                        );

                    }
                );


                chatList.appendChild(
                    chatItem
                );

            }
        );

    }


    // =================================================
    // CLEAR ALL CHAT HISTORY
    // =================================================

    function clearAllHistory() {

        const chats =
            getChats();


        if (
            chats.length === 0
        ) {

            clearChatScreen();


            currentChatId =
                createChatId();


            renderChatList();


            return;

        }


        const confirmed =
            confirm(
                "Are you sure you want to delete all previous chats?"
            );


        if (!confirmed) {

            return;

        }


        localStorage.removeItem(
            getHistoryKey()
        );


        currentChatId =
            createChatId();


        clearChatScreen();


        renderChatList();


        console.log(
            "🗑 All chat history cleared"
        );

    }


    // =================================================
    // SHOW LOGIN
    // =================================================

    if (showLoginBtn) {

        showLoginBtn.addEventListener(
            "click",
            function () {

                registerBox.classList.add(
                    "hidden"
                );


                loginBox.classList.remove(
                    "hidden"
                );


                if (registerError) {

                    registerError.textContent =
                        "";

                    registerError.style.color =
                        "";

                }


                if (loginError) {

                    loginError.textContent =
                        "";

                    loginError.style.color =
                        "";

                }

            }
        );

    }


    // =================================================
    // SHOW REGISTER
    // =================================================

    if (showRegisterBtn) {

        showRegisterBtn.addEventListener(
            "click",
            function () {

                loginBox.classList.add(
                    "hidden"
                );


                registerBox.classList.remove(
                    "hidden"
                );


                if (loginError) {

                    loginError.textContent =
                        "";

                    loginError.style.color =
                        "";

                }


                if (registerError) {

                    registerError.textContent =
                        "";

                    registerError.style.color =
                        "";

                }

            }
        );

    }


    // =================================================
    // REGISTER ACCOUNT
    // =================================================

    if (registerBtn) {

        registerBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                // -------------------------------------
                // GET INPUT VALUES
                // -------------------------------------

                const name =
                    registerName.value.trim();


                const email =
                    registerEmail.value
                        .trim()
                        .toLowerCase();


                const password =
                    registerPassword.value;


                // -------------------------------------
                // VALIDATE NAME
                // -------------------------------------

                if (
                    name === ""
                ) {

                    registerError.textContent =
                        "Please enter your name.";

                    registerError.style.color =
                        "red";

                    return;

                }


                // -------------------------------------
                // VALIDATE EMAIL
                // -------------------------------------

                if (
                    email === "" ||
                    !email.includes("@")
                ) {

                    registerError.textContent =
                        "Please enter a valid email.";

                    registerError.style.color =
                        "red";

                    return;

                }


                // -------------------------------------
                // VALIDATE PASSWORD
                // -------------------------------------

                if (
                    password.length < 6
                ) {

                    registerError.textContent =
                        "Password must contain at least 6 characters.";

                    registerError.style.color =
                        "red";

                    return;

                }


                // -------------------------------------
                // GET ALL USERS
                // -------------------------------------

                const users =
                    getUsers();


                // -------------------------------------
                // CHECK EXISTING EMAIL
                // -------------------------------------

                const existingUser =
                    users.find(
                        user =>
                            user.email &&
                            user.email
                                .toLowerCase() ===
                            email
                    );


                if (existingUser) {

                    registerError.textContent =
                        "⚠️ Account already exists. Please Sign In.";

                    registerError.style.color =
                        "red";


                    // Automatically move to login
                    setTimeout(
                        function () {

                            registerBox.classList.add(
                                "hidden"
                            );


                            loginBox.classList.remove(
                                "hidden"
                            );


                            loginEmail.value =
                                email;


                            loginPassword.value =
                                "";

                        },
                        800
                    );


                    return;

                }


                // -------------------------------------
                // CREATE NEW USER
                // -------------------------------------

                const newUser = {

                    name:
                        name,

                    email:
                        email,

                    password:
                        password

                };


                // -------------------------------------
                // ADD TO USERS ARRAY
                // -------------------------------------

                users.push(
                    newUser
                );


                // -------------------------------------
                // SAVE USER
                // -------------------------------------

                saveUsers(
                    users
                );


                // -------------------------------------
                // OLD STORAGE COMPATIBILITY
                // -------------------------------------

                localStorage.setItem(
                    "studymateUser",
                    JSON.stringify(
                        newUser
                    )
                );


                console.log(
                    "✅ Account created:",
                    email
                );


                // -------------------------------------
                // SUCCESS MESSAGE
                // -------------------------------------

                registerError.textContent =
                    "✅ Account created successfully!";

                registerError.style.color =
                    "green";


                // -------------------------------------
                // GO TO LOGIN
                // -------------------------------------

                setTimeout(
                    function () {

                        registerBox.classList.add(
                            "hidden"
                        );


                        loginBox.classList.remove(
                            "hidden"
                        );


                        loginEmail.value =
                            email;


                        loginPassword.value =
                            "";


                        registerName.value =
                            "";


                        registerEmail.value =
                            "";


                        registerPassword.value =
                            "";


                        registerError.textContent =
                            "";

                    },
                    1000
                );

            }
        );

    }


    // =================================================
    // LOGIN
    // =================================================

    if (loginBtn) {

        loginBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                // -------------------------------------
                // GET LOGIN VALUES
                // -------------------------------------

                const email =
                    loginEmail.value
                        .trim()
                        .toLowerCase();


                const password =
                    loginPassword.value;


                // -------------------------------------
                // VALIDATE EMAIL
                // -------------------------------------

                if (
                    email === ""
                ) {

                    loginError.textContent =
                        "Please enter your email.";

                    loginError.style.color =
                        "red";

                    return;

                }


                // -------------------------------------
                // VALIDATE PASSWORD
                // -------------------------------------

                if (
                    password === ""
                ) {

                    loginError.textContent =
                        "Please enter your password.";

                    loginError.style.color =
                        "red";

                    return;

                }


                // -------------------------------------
                // GET ALL SAVED USERS
                // -------------------------------------

                const users =
                    getUsers();


                console.log(
                    "Number of saved accounts:",
                    users.length
                );


                // -------------------------------------
                // FIND USER BY EMAIL
                // -------------------------------------

                const user =
                    users.find(
                        savedUser =>
                            savedUser.email &&
                            savedUser.email
                                .toLowerCase() ===
                            email
                    );


                // -------------------------------------
                // ACCOUNT NOT FOUND
                // -------------------------------------

                if (!user) {

                    loginError.textContent =
                        "❌ No account found with this email. Please create an account first.";

                    loginError.style.color =
                        "red";

                    return;

                }


                // -------------------------------------
                // CHECK PASSWORD
                // -------------------------------------

                if (
                    user.password !==
                    password
                ) {

                    loginError.textContent =
                        "❌ Incorrect password. Please enter the password used when creating the account.";

                    loginError.style.color =
                        "red";

                    return;

                }


                // -------------------------------------
                // LOGIN SUCCESS
                // -------------------------------------

                localStorage.setItem(
                    "studymateLoggedIn",
                    "true"
                );


                // Store only name + email
                // for current session
                const currentUser = {

                    name:
                        user.name,

                    email:
                        user.email

                };


                localStorage.setItem(
                    "studymateCurrentUser",
                    JSON.stringify(
                        currentUser
                    )
                );


                currentUserEmail =
                    user.email;


                console.log(
                    "✅ Login successful:",
                    user.email
                );


                loginError.textContent =
                    "✅ Login successful!";

                loginError.style.color =
                    "green";


                // -------------------------------------
                // OPEN CHAT APPLICATION
                // -------------------------------------

                setTimeout(
                    function () {

                        openChat(
                            user
                        );

                    },
                    300
                );

            }
        );

    }


    // =================================================
    // OPEN CHAT APPLICATION
    // =================================================

    function openChat(user) {

        // -----------------------------------------
        // HIDE LOGIN
        // -----------------------------------------

        if (authPage) {

            authPage.classList.add(
                "hidden"
            );

        }


        // -----------------------------------------
        // SHOW CHAT
        // -----------------------------------------

        if (chatApp) {

            chatApp.classList.remove(
                "hidden"
            );

        }


        // -----------------------------------------
        // SET CURRENT USER
        // -----------------------------------------

        currentUserEmail =
            user.email;


        // -----------------------------------------
        // DISPLAY STUDENT NAME
        // -----------------------------------------

        if (studentName) {

            studentName.textContent =
                "👤 " +
                user.name;

        }


        console.log(
            "👤 Logged in as:",
            user.name
        );


        // -----------------------------------------
        // LOAD CHAT HISTORY
        // -----------------------------------------

        const chats =
            getChats();


        // -----------------------------------------
        // FIND LATEST REAL CHAT
        // -----------------------------------------

        const savedChats =
            chats.filter(
                chat =>
                    chat.messages &&
                    chat.messages.length > 0
            );


        if (
            savedChats.length > 0
        ) {

            // Sort newest first
            savedChats.sort(
                (a, b) =>
                    new Date(
                        b.updatedAt
                    ) -
                    new Date(
                        a.updatedAt
                    )
            );


            const latest =
                savedChats[0];


            currentChatId =
                latest.id;


            clearChatScreen();


            // Restore latest messages
            latest.messages.forEach(
                function (msg) {

                    addMessage(
                        msg.role,
                        msg.text
                    );

                }
            );

        }
        else {

            // Start blank chat
            currentChatId =
                createChatId();


            clearChatScreen();

        }


        // Refresh previous chats
        renderChatList();

    }


    // =================================================
    // AUTO LOGIN AFTER PAGE REFRESH
    // =================================================

    function checkExistingLogin() {

        const loggedIn =
            localStorage.getItem(
                "studymateLoggedIn"
            );


        const currentUserData =
            localStorage.getItem(
                "studymateCurrentUser"
            );


        if (
            loggedIn !== "true" ||
            !currentUserData
        ) {

            return;

        }


        try {

            const currentUser =
                JSON.parse(
                    currentUserData
                );


            if (
                !currentUser.email
            ) {

                throw new Error(
                    "Invalid current user"
                );

            }


            // Make sure account still exists
            const users =
                getUsers();


            const savedUser =
                users.find(
                    user =>
                        user.email &&
                        user.email
                            .toLowerCase() ===
                        currentUser.email
                            .toLowerCase()
                );


            if (!savedUser) {

                console.warn(
                    "⚠️ Saved account not found."
                );


                localStorage.removeItem(
                    "studymateLoggedIn"
                );


                localStorage.removeItem(
                    "studymateCurrentUser"
                );


                return;

            }


            currentUserEmail =
                savedUser.email;


            openChat(
                savedUser
            );


            console.log(
                "✅ Auto login successful."
            );

        }
        catch (error) {

            console.error(
                "❌ Auto login error:",
                error
            );


            localStorage.removeItem(
                "studymateLoggedIn"
            );


            localStorage.removeItem(
                "studymateCurrentUser"
            );

        }

    }


    // =================================================
    // LOGOUT
    // =================================================

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function () {

                console.log(
                    "🚪 Logging out..."
                );


                // -------------------------------------
                // REMOVE LOGIN SESSION ONLY
                // -------------------------------------
                //
                // IMPORTANT:
                // DO NOT REMOVE studymateUsers
                //
                // DO NOT REMOVE chat history
                //
                // Account remains saved.
                // -------------------------------------

                localStorage.removeItem(
                    "studymateLoggedIn"
                );


                localStorage.removeItem(
                    "studymateCurrentUser"
                );


                // -------------------------------------
                // HIDE CHAT
                // -------------------------------------

                if (chatApp) {

                    chatApp.classList.add(
                        "hidden"
                    );

                }


                // -------------------------------------
                // SHOW LOGIN
                // -------------------------------------

                if (authPage) {

                    authPage.classList.remove(
                        "hidden"
                    );

                }


                // -------------------------------------
                // RESET STATE
                // -------------------------------------

                currentUserEmail =
                    null;


                currentChatId =
                    null;


                // -------------------------------------
                // CLEAR LOGIN INPUTS
                // -------------------------------------

                if (loginEmail) {

                    loginEmail.value =
                        "";

                }


                if (loginPassword) {

                    loginPassword.value =
                        "";

                }


                // Clear chat
                clearChatScreen();


                // Show login box
                if (registerBox) {

                    registerBox.classList.add(
                        "hidden"
                    );

                }


                if (loginBox) {

                    loginBox.classList.remove(
                        "hidden"
                    );

                }


                if (loginError) {

                    loginError.textContent =
                        "";

                }


                console.log(
                    "✅ Logged out. Account is still saved."
                );

            }
        );

    }


    // =================================================
    // NEW CHAT BUTTON
    // =================================================

    if (newChatBtn) {

        newChatBtn.addEventListener(
            "click",
            function () {

                startNewChat();

            }
        );

    }


    // =================================================
    // SEARCH CHAT
    // =================================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                renderChatList();

            }
        );

    }


    // =================================================
    // CLEAR ALL CHAT HISTORY BUTTON
    // =================================================

    if (clearBtn) {

        clearBtn.addEventListener(
            "click",
            function () {

                clearAllHistory();

            }
        );

    }


    // =================================================
    // SEND MESSAGE TO GEMINI
    // =================================================

    if (chatForm) {

        chatForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                // -------------------------------------
                // GET QUESTION
                // -------------------------------------

                const question =
                    messageInput.value.trim();


                if (
                    question === ""
                ) {

                    return;

                }


                console.log(
                    "🧑 Student:",
                    question
                );


                // -------------------------------------
                // SHOW USER MESSAGE
                // -------------------------------------

                addMessage(
                    "user",
                    question
                );


                // -------------------------------------
                // SAVE USER MESSAGE
                // -------------------------------------

                saveMessageToCurrentChat(
                    "user",
                    question
                );


                // Clear input
                messageInput.value =
                    "";


                // -------------------------------------
                // SHOW TYPING
                // -------------------------------------

                if (typing) {

                    typing.classList.remove(
                        "hidden"
                    );

                }


                try {

                    // ---------------------------------
                    // GEMINI BACKEND
                    // ---------------------------------

                    const response =
                        await fetch(
                            "http://localhost:5000/api/chat",
                            {

                                method:
                                    "POST",


                                headers:
                                    {
                                        "Content-Type":
                                            "application/json"
                                    },


                                body:
                                    JSON.stringify(
                                        {
                                            message:
                                                question
                                        }
                                    )

                            }
                        );


                    // ---------------------------------
                    // CHECK RESPONSE
                    // ---------------------------------

                    if (
                        !response.ok
                    ) {

                        throw new Error(
                            "Backend returned error: " +
                            response.status
                        );

                    }


                    // ---------------------------------
                    // GET JSON
                    // ---------------------------------

                    const data =
                        await response.json();


                    console.log(
                        "🤖 Backend response:",
                        data
                    );


                    // Hide typing
                    if (typing) {

                        typing.classList.add(
                            "hidden"
                        );

                    }


                    // ---------------------------------
                    // AI ANSWER
                    // ---------------------------------

                    if (
                        data.success
                    ) {

                        addMessage(
                            "assistant",
                            data.answer
                        );


                        saveMessageToCurrentChat(
                            "assistant",
                            data.answer
                        );

                    }


                    // ---------------------------------
                    // BACKEND ERROR
                    // ---------------------------------

                    else {

                        const errorMessage =
                            "❌ " +
                            (
                                data.error ||
                                "Unable to get answer."
                            );


                        addMessage(
                            "assistant",
                            errorMessage
                        );


                        saveMessageToCurrentChat(
                            "assistant",
                            errorMessage
                        );

                    }

                }
                catch (error) {

                    console.error(
                        "❌ Chat error:",
                        error
                    );


                    if (typing) {

                        typing.classList.add(
                            "hidden"
                        );

                    }


                    const errorMessage =
                        "❌ Cannot connect to StudyMate AI backend. Make sure your backend is running on port 5000.";


                    addMessage(
                        "assistant",
                        errorMessage
                    );


                    saveMessageToCurrentChat(
                        "assistant",
                        errorMessage
                    );

                }

            }
        );

    }


    // =================================================
    // ADD MESSAGE TO SCREEN
    // =================================================

    function addMessage(
        role,
        text
    ) {

        if (!messages) {

            return;

        }


        // -----------------------------------------
        // MESSAGE CONTAINER
        // -----------------------------------------

        const messageDiv =
            document.createElement(
                "div"
            );


        messageDiv.className =
            "message " +
            role;


        // -----------------------------------------
        // ICON
        // -----------------------------------------

        const icon =
            document.createElement(
                "div"
            );


        icon.className =
            "message-icon";


        icon.textContent =
            role === "user"
                ? "👤"
                : "🤖";


        // -----------------------------------------
        // BUBBLE
        // -----------------------------------------

        const bubble =
            document.createElement(
                "div"
            );


        bubble.className =
            "bubble";


        // textContent prevents HTML injection
        bubble.textContent =
            text;


        // -----------------------------------------
        // ADD ELEMENTS
        // -----------------------------------------

        messageDiv.appendChild(
            icon
        );


        messageDiv.appendChild(
            bubble
        );


        messages.appendChild(
            messageDiv
        );


        // -----------------------------------------
        // SCROLL DOWN
        // -----------------------------------------

        messages.scrollTop =
            messages.scrollHeight;

    }


    // =================================================
    // ENTER TO SEND
    // =================================================

    if (messageInput) {

        messageInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();


                    if (chatForm) {

                        chatForm.requestSubmit();

                    }

                }

            }
        );

    }


    // =================================================
    // START APPLICATION
    // =================================================

    checkExistingLogin();


    // =================================================
    // INITIAL CHAT LIST
    // =================================================

    if (
        currentUserEmail
    ) {

        renderChatList();

    }


    console.log(
        "✅ StudyMate AI frontend ready"
    );

});