"use client";
const uuid = 343244;
const shareOptions = ["wb", "fb", "email", "tg"];

const ShareID = () => {
    const ClickHandler = () => {
        navigator.clipboard.writeText(uuid);
    };

    return (
        <div>
            <div>
                <span>Your unique ID </span>
                {uuid}
                <button onClick={ClickHandler}>Copy</button>
                <div>
                    {shareOptions.map((media, ind) => (
                        <span key={ind}>{media} </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShareID;
