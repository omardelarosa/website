// add JS here.

// This fixes Moxfield embeds
function moxfieldOnMessage(e) {
    const t = e.data;
    if ("object" == typeof t && "moxfield" === t.type) {
        const e = document.getElementById(t.id);
        e && (e.style.height = t.data + "px");
    }
}
function moxfieldOnLoad(e) {
    e.target &&
        e.target.contentWindow &&
        e.target.contentWindow.postMessage(
            { type: "moxfield", data: e.target.id },
            "*"
        );
}

window.addEventListener("message", moxfieldOnMessage);

function setTimestamps() {
    if (document.querySelector(".posted-at").length > 0) {
        return;
    }

    // Add dates to all posts
    const createdAtElements = document.querySelectorAll(
        ".frontmatter .token.key"
    ); // Select all div elements
    const matchingElements = Array.from(createdAtElements).filter((element) =>
        element.textContent.includes("createdAt")
    );
    if (matchingElements.length > 0) {
        for (const element of matchingElements) {
            const timestamp =
                element.nextElementSibling.nextElementSibling.textContent;
            const date = new Date(Number.parseInt(timestamp));
            element.nextElementSibling.nextElementSibling.textContent =
                date.toISOString();
            const headerElement = document.querySelector(`.mod-header.mod-ui`);
            headerElement.insertAdjacentHTML(
                "beforeend",
                `<div class="posted-at">${date.toLocaleString()}</div>`
            );
        }
    }
    console.log("Timestamps set");
}
// Things to do on page navigation
function clientSideUpdates() {
    console.log("Navigating to new page");
    setTimestamps();
}

window.setInterval(clientSideUpdates, 1000);
