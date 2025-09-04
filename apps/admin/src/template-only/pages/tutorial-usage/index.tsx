import PageControl from '@/components/PageControl';
import Intro from '@/Example/Intro';
import { ExampleList2, KeyPoint, StyledLink } from '@/Example/styles';

const TutorialUsage = () => {
	return (
		<>
			<PageControl title='Tutorial and Usage' />

			{/* <Intro
        title="Full Documentation"
        content={
          <>
            Read the full documentation Here 👉
            <StyledLink
              href="https://react-template-docs.netlify.app/"
              rel="noreferrer"
            >
              {' '}
              React Template Documentation
            </StyledLink>{' '}
            ( currently still in progress... )
          </>
        }
      /> */}
			<Intro
				title='Intro'
				content={
					<>
						<p>
							This reactjs template is centered around 3 key tech stacks -{' '}
							<StyledLink href='https://nextjs.org/' rel='noreferrer'>
								{' '}
								NextJs
							</StyledLink>
							,
							<StyledLink href='https://redux-toolkit.js.org/' rel='noreferrer'>
								{' '}
								Redux(Toolkit)
							</StyledLink>
							, and
							<StyledLink href='https://mui.com/' rel='noreferrer'>
								{' '}
								Material UI{' '}
							</StyledLink>
							and written entirely in{' '}
							<StyledLink href='https://www.typescriptlang.org/docs/' rel='noreferrer'>
								Typescript{' '}
							</StyledLink>
							for maximum type-safety.
						</p>
						<p>
							The template is designed to be as simple as possible, while still providing a solid foundation for any
							react project.
						</p>
						<div>
							Even if you won&apos;t use any of the components here you should find using the template saves you time
							for setting up some of these useful features that every good app should include:
							<ul
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '0.5rem',
								}}
							>
								<li>A decent project structure with react community best practices in mind</li>
								<li>Seo friendly (nextjs, custom document setup)</li>
								<li>Styling setup (materialUI) to work with SSR (nextjs)</li>
								<li>State management setup (redux toolkit)</li>
								<li>Type safe ready with typescript setup</li>
								<li>HOC layout and other design patterns</li>
							</ul>
						</div>
					</>
				}
			/>
			{/* <Intro
        title="Table of contents"
        content="The list below includes the main common components that are provided in this boilerplate template."
      />
      <ExampleList>
        <Link href="/components/input" passHref>
          <Button label="Input" color="primary" variant="contained" />
        </Link>
        <Link href="/components/select" passHref>
          <Button label="Select" color="primary" variant="contained" />
        </Link>
        <Link href="/components/radio" passHref>
          <Button label="Radio" color="primary" variant="contained" />
        </Link>
        <Link href="/components/checkbox" passHref>
          <Button label="Checkbox" color="primary" variant="contained" />
        </Link>
        <Link href="/components/tabs" passHref>
          <Button label="Tabs" color="primary" variant="contained" />
        </Link>
        <Link href="/components/table" passHref>
          <Button label="Table" color="primary" variant="contained" />
        </Link>
        <Link href="/components/modal" passHref>
          <Button label="Modal" color="primary" variant="contained" />
        </Link>
        <Link href="/components/datepicker" passHref>
          <Button label="Datepicker" color="primary" variant="contained" />
        </Link>
        <Link href="/components/loaders" passHref>
          <Button label="Loaders" color="primary" variant="contained" />
        </Link>
      </ExampleList> */}
			<Intro
				title='Clean Project Setup'
				content='Instructions and advice on how to remove all 
      example code in this project as well as important reminders 
      so nothing is broken during any file delete process.
			Please read the below instructions before you start any code adjustments.'
			/>
			<b>To Get Rid of all example codes:</b>
			<ExampleList2>
				<li>
					Delete the folder <KeyPoint>Example</KeyPoint> in the components directory
				</li>
				<li>
					Delete <KeyPoint>example-api-fetch</KeyPoint> and <KeyPoint>example-page</KeyPoint> folder in the pages
					directory
				</li>
			</ExampleList2>
			<b>Delete any unused icons and images:</b>
			<ExampleList2>
				<li>
					Icon components can be found in the <KeyPoint>Icon</KeyPoint> folder in the components directory, and svg
					icons can be found in the <KeyPoint>icons</KeyPoint> folder in the public directory pages directory
				</li>
				<li>
					Warning : Unfortunately, some core components are using some of the icons in the above mentioned directories,
					so please remove with caution.
				</li>
			</ExampleList2>
			<b>Remove any unused libraries:</b>
			<ExampleList2>
				<li>
					Feel free to npm uninstall any libraries that wont be used in your web app. Please be careful about removing
					any core libraries.
				</li>
			</ExampleList2>
			<b>Other Advice:</b>
			<ExampleList2>
				<li>
					You may feel some implemented features are not needed in your web app, or you decide to use a different
					approach.
					<p>
						For example: login, auth, data fetching, etc, certain components that you are sure will never be used in
						your app, <strong>feel free to remove them</strong>.
					</p>
					<p>Again, please proceed with caution when deciding what to keep and what to remove in your app.</p>
				</li>
				<li>
					Suggestion: Examples are provided in this template to help you get a quick start. They can be a good reference
					when you are stuck or need help, it may be wise to delete them afterwards when you are more familiar with how
					to use this template.
				</li>
			</ExampleList2>
			<b>Last but not least:</b>
			<ExampleList2>
				<li>Happy Coding! Wish you all the best in your project!</li>
			</ExampleList2>
		</>
	);
};

export default TutorialUsage;
