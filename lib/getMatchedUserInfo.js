const getMatchedUserInfo = (users, UserLoggedIn) => {
    const newUsers = {...users};
    delete newUsers[UserLoggedIn];

    const [id,user] = Object.entries(newUsers).flat();

    return { id,...user };
}

export default getMatchedUserInfo;