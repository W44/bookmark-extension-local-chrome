document.getElementById("exportBookmarks").addEventListener("click", () => {
    chrome.bookmarks.getTree((tree) => {
        let htmlContent = "<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<html>\n<head>\n<title>Bookmarks</title>\n</head>\n<body>\n<h1>Bookmarks</h1>\n<dl>\n";
        let existingBookmarks = []; // To store unique bookmarks

        function isDuplicate(url) {
            return existingBookmarks.some(bookmark => bookmark.url === url);
        }

        function traverseBookmarks(bookmarkNode) {
            if (bookmarkNode.url && !isDuplicate(bookmarkNode.url)) {
                htmlContent += `<dt><a href="${bookmarkNode.url}">${bookmarkNode.title}</a></dt>\n`;
                existingBookmarks.push({ url: bookmarkNode.url, title: bookmarkNode.title });
            } else if (bookmarkNode.children) {
                htmlContent += `<dt>${bookmarkNode.title}</dt>\n<dl>\n`;
                bookmarkNode.children.forEach(child => traverseBookmarks(child));
                htmlContent += "</dl>\n";
            }
        }

        tree.forEach(bookmark => traverseBookmarks(bookmark));
        htmlContent += "</dl>\n</body>\n</html>";

        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        // Create a download link
        const a = document.createElement("a");
        a.href = url;
        a.download = "bookmarks.html";  // This triggers the download and will overwrite previous file if user chooses to do so.
        a.click();
    });
});
