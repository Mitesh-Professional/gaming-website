document.getElementById('scrollButton').addEventListener('click', function() {
    // Scroll to the element with the id 'latestGameSection'
    document.getElementById('latestGameSection').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
  