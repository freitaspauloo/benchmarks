(function () {
  const HOME = "/";
  const BACK_ID = "research-sidebar-back";

  function normalizePath(path) {
    if (!path || path === "/index") return HOME;
    return path;
  }

  function createBackLink() {
    const link = document.createElement("a");
    link.id = BACK_ID;
    link.href = HOME;
    link.className = "research-sidebar-back";
    link.setAttribute("aria-label", "Back to introduction");
    link.innerHTML =
      '<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12.5 15L7.5 10L12.5 5"/></svg><span>Back</span>';
    return link;
  }

  function updateSidebarBack() {
    const path = normalizePath(
      document.documentElement.getAttribute("data-current-path")
    );
    const onHome = path === HOME;

    document.querySelectorAll(`#${BACK_ID}`).forEach((node) => node.remove());

    if (onHome) return;

    document.querySelectorAll(".sidebar-group-header").forEach((header) => {
      if (header.querySelector(`#${BACK_ID}`)) return;
      header.insertBefore(createBackLink(), header.firstChild);
    });
  }

  updateSidebarBack();

  const observer = new MutationObserver(updateSidebarBack);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-current-path"],
  });

  const sidebar = document.getElementById("sidebar-content");
  if (sidebar) {
    observer.observe(sidebar, { childList: true, subtree: true });
  }

  const mobileNav = document.getElementById("mobile-nav-content");
  if (mobileNav) {
    observer.observe(mobileNav, { childList: true, subtree: true });
  }
})();
