<script>
	import { page } from '$app/stores';
</script>

<header>
	<div class="corner">
		
	</div>
	<nav>
		<svg class="group" viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li class="{$page.url.pathname === '/' ? 'text-primary-300':''}" aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Search</a>
			</li>
			<li class={$page.url.pathname === '/search' ? 'text-primary-300':''} aria-current={$page.url.pathname === '/search' ? 'page' : undefined}>
				<a href="/search">Search</a>
			</li>
			<li class={$page.url.pathname === '/add' ? 'text-primary-300':''} aria-current={$page.url.pathname.startsWith('/add') ? 'page' : undefined}>
				<a href="/add">Add</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - 6px);
		border: 6px solid;
		border-top: 6px solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: var(--color-theme-2) 2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
