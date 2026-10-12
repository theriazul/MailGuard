const emailForm = document.getElementById('emailForm');
const emailInput = document.getElementById('emailInput');
const clearBtn = document.getElementById('clearBtn');
const resultEmpty = document.getElementById('resultEmpty');
const resultContent = document.getElementById('resultContent');
const statusBadge = document.getElementById('statusBadge');

document.getElementById('year').textContent = new Date().getFullYear();

function isValidEmailSyntax(value) {
  // Deliberately basic format validation; this does not prove a mailbox exists.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function getDomain(value) {
  const at = value.lastIndexOf('@');
  return at >= 0 ? value.slice(at + 1).toLowerCase() : '';
}

function setValue(id, text, kind = '') {
  const node = document.getElementById(id);
  node.textContent = text;
  node.classList.remove('bad', 'neutral');
  if (kind) node.classList.add(kind);
}

emailForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();
  if (!email) {
    emailInput.focus();
    emailInput.setCustomValidity('Please enter an email address.');
    emailInput.reportValidity();
    emailInput.setCustomValidity('');
    return;
  }

  const syntaxValid = isValidEmailSyntax(email);
  const domain = getDomain(email);
  const domainLooksValid = domain.includes('.') && !domain.startsWith('.') &&
    !domain.endsWith('.') && !domain.includes('..');

  resultEmpty.classList.add('hidden');
  resultContent.classList.remove('hidden');
  document.getElementById('resultTitle').textContent = syntaxValid ? 'Review complete' : 'Review needed';
  document.getElementById('resultEmail').textContent = email;
  document.getElementById('resultDomain').textContent = domain || 'No domain detected';

  statusBadge.textContent = syntaxValid && domainLooksValid ? 'Format looks valid' : 'Invalid format';
  statusBadge.classList.toggle('invalid', !(syntaxValid && domainLooksValid));

  setValue('syntaxValue', syntaxValid ? 'Passed' : 'Failed', syntaxValid ? '' : 'bad');
  setValue('domainValue', domainLooksValid ? 'Basic structure OK' : 'Check domain', domainLooksValid ? '' : 'bad');
  setValue('mxValue', 'Not checked', 'neutral');
  setValue('deliveryValue', 'Unknown', 'neutral');

  document.getElementById('resultDisclaimer').textContent =
    'Demo limitation: this page checks only basic syntax and domain structure. It does not query DNS/MX records, detect disposable addresses, or verify mailbox existence.';
  document.getElementById('resultCard').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

clearBtn.addEventListener('click', () => {
  emailInput.value = '';
  emailInput.focus();
  resultContent.classList.add('hidden');
  resultEmpty.classList.remove('hidden');
});

document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light');
  const light = document.body.classList.contains('light');
  document.getElementById('themeToggle').textContent = light ? '☾' : '☼';
  document.querySelector('meta[name="theme-color"]').setAttribute('content', light ? '#f6f6f5' : '#0b0c0f');
});

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '×' : '☰';
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  });
});
