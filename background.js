chrome.commands.onCommand.addListener(function (command) {
  if (command === "sound_tab_command") {
    chrome.tabs.query({ audible: true, muted: false }, (audibleTabs) => {
    if (audibleTabs.length === 0) return;

    chrome.tabs.query({ currentWindow: true, active: true }, (activeTabs) => {
      const currentTab = activeTabs[0];
      const sortedAudibleTabs = sortTabsByPosition(audibleTabs);
      const nextTab = findNextTab(sortedAudibleTabs, currentTab);

      if (nextTab) {
        focusTab(nextTab);
      }
    });
  });
  }
});

function sortTabsByPosition(tabs) {
  return tabs.sort((a, b) => a.windowId - b.windowId || a.index - b.index);
}

function findNextTab(tabs, currentTab) {
  const currentIndex = tabs.findIndex((tab) => tab.id === currentTab.id);
  return currentIndex === -1 || currentIndex === tabs.length - 1
    ? tabs[0]
    : tabs[currentIndex + 1];
}

function focusTab(tab) {
  chrome.windows.update(tab.windowId, { focused: true });
  chrome.tabs.update(tab.id, { active: true });
}
