import '../scss/style.scss';

console.log('Works!');

(function searcRepositories() {
  const searchInput = document.querySelector('#search-input'),
    searchFound = document.querySelector('.search__found'),
    output = document.querySelector('.github-result__output'),
    additionalRepo = document.querySelector('.github-result__output'),
    resultCounter = 5;



  searchInput.addEventListener('keyup', debounce(searchRepo, 500));



  async function searchRepo() {
    const value = searchInput.value.trim();
    if (value) {
      return await fetch(`https://api.github.com/search/repositories?q=${value}&per_page=${resultCounter}`)
        .then((res) => {
          if (res.ok) {
            res.json().then((res) => {

              if (!res.total_count) {
                outputResult(res.items);

                return searchFound.innerHTML = `<span class="not-found">Совпадений нет...</span>`
              }
              console.log(res);
              clearResult()
              outputResult(res.items)
              searchFound.addEventListener('click', (e) => {
                const name = e.target.textContent
                const repo = res.items.find(item => item.full_name === name)
                const owner = repo.owner.login
                const stars = repo.stargazers_count

                if (e.target.classList.contains('found__item')) {
                  clearInput();
                  outputRepo(name, owner, stars)
                }

              })

            })
          } else {

          }
        })
    }
  }

  function outputResult(repos) {
    searchFound.classList.add('is-shown');
    repos.forEach(repo => {
      const itemHtml = `<div class="found__item" tabindex="0">${repo.full_name}</div>`
      searchFound.insertAdjacentHTML('afterbegin', itemHtml)
    });
  }

  function clearResult() {
    searchFound.innerHTML = '';
    // this.searchFound.classList.remove('is-shown')
  }

  function clearInput() {
    searchInput.value = '';
  }

  function debounce(fn, ms) {
    let timeout;
    return function () {
      const fnCall = () => fn.apply(this, arguments)

      clearTimeout(timeout)

      timeout = setTimeout(fnCall, ms)
    }
  }

  function outputRepo(name, owner, stars) {
    const repoHtml = `
        <div class="output__item item-output">
          <div class="item-output__name">
            Name: ${name}
          </div>
          <div class="item-output__owner">
            Owner: ${owner}
          </div>
          <div class="item-output__stars">
            Stars: ${stars}
          </div>
          <button class="item-output__delete" aria-label="удалить данное поле">
            <svg width="33" height="37" viewBox="0 0 33 37" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g class="trash-head">
                <path
                  d="M12.1624 5.81091H17.1763V6.65457H18.9869V5.69281C18.9872 4.75943 18.2282 4 17.2953 4H12.0434C11.1104 4 10.3515 4.75943 10.3515 5.69281V6.65457H12.1624V5.81091Z" />
                <path
                  d="M26.2997 11.0349L25.7051 9.25238C25.5483 8.78249 25.1084 8.46548 24.6129 8.46548H4.72554C4.23024 8.46548 3.7901 8.78249 3.63354 9.25238L3.03891 11.0349C2.92424 11.3787 3.07347 11.7293 3.35202 11.9042C3.46555 11.9754 3.5999 12.0182 3.74753 12.0182H25.5911C25.7387 12.0182 25.8733 11.9754 25.9866 11.904C26.2652 11.7291 26.4144 11.3785 26.2997 11.0349Z" />
              </g>

              <path
                d="M23.1686 13.8291H6.17001C5.70424 13.8291 5.33757 14.2264 5.37511 14.6908L6.79623 32.2635C6.87543 33.2445 7.69368 34 8.67673 34H20.6617C21.6447 34 22.463 33.2445 22.5422 32.2632L23.9633 14.6908C24.0011 14.2264 23.6344 13.8291 23.1686 13.8291V13.8291ZM10.286 32.1257C10.267 32.1268 10.248 32.1275 10.2292 32.1275C9.75453 32.1275 9.35605 31.7579 9.32652 31.2777L8.43594 16.8515C8.40527 16.3523 8.78499 15.9227 9.28395 15.892C9.78131 15.8618 10.2128 16.2406 10.2434 16.74L11.1338 31.1662C11.1647 31.6654 10.785 32.0948 10.286 32.1257V32.1257ZM15.5848 31.2221C15.5848 31.7219 15.1795 32.1273 14.6794 32.1273C14.1793 32.1273 13.7739 31.7219 13.7739 31.2221V16.7956C13.7739 16.2955 14.1793 15.8902 14.6794 15.8902C15.1793 15.8902 15.5848 16.2955 15.5848 16.7956V31.2221ZM20.9027 16.849L20.0524 31.2752C20.0242 31.7563 19.6251 32.1273 19.1494 32.1273C19.1316 32.1273 19.1135 32.1268 19.0954 32.1259C18.5962 32.0964 18.2154 31.6679 18.2449 31.1687L19.095 16.7423C19.1243 16.2431 19.5514 15.8623 20.0519 15.8918C20.5511 15.9211 20.932 16.3498 20.9027 16.849V16.849Z" />
            </svg>
          </button>
        </div>
      `
    additionalRepo.insertAdjacentHTML('afterbegin', repoHtml)
  }

  function closeResults() {
    searchFound.classList.remove('is-shown')
  }

  function deleteAdditionalRepo() {

  }

  output.addEventListener('click', (e) => {
    e.preventDefault();

    if (e.target.closest('.item-output__delete')) {
      e.target.closest('.output__item').remove();
    }
  })

  window.addEventListener('click', (e) => {
    if (!e.target.classList.contains('found__item')) {
      closeResults();
    }
  });


}());
