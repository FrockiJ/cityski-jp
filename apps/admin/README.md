# ⚛️ Cloud Frontend Template [React] (Redux, MaterialUI)

## 📖 Full Documentation

Read the full documentation here 👉 [React Template Documentation](https://react-template-docs.netlify.app/)

## ✨ Intro & Features

This template will save you time in setting up a new project🔥.

It includes 📦 :

- ✅ Full typescript support
- ✅ Folder structure
- ✅ NextJS for SSR, SEO, and other useful features
- ✅ MaterialUI (including setup to work with NextJS and Typescript)
- ✅ State management setup with Redux
- ✅ HOC Layout and other useful design patterns

It also includes many premade components that you can import into your project and start using. The list of completed components will be listed in the "Components" section below along with their respective docs.

### Here is a current overview diagram of the template features and potential future changes:

👉 https://excalidraw.com/#json=w72F1UKANEiHVk0ckzgAW,T4aTREwtWaDSTgKl5Am8ug
https://excalidraw.com/#json=w72F1UKANEiHVk0ckzgAW,T4aTREwtWaDSTgKl5Am8ug

## 🛠️ Setting up the Dev Environment

> The first thing you should do to setup the template is to run a clean install:

`npm i`

> After installing the required packages, make sure you have a copy of the required .env file.

You can find the default version of this at: [google drive link](https://drive.google.com/drive/u/0/folders/1QLhuWyhQVBJs7lqf6fssXpghWLfJAVAc)

> Place it in the root of the directory, then start the server with:

`npm run dev`

By default the app dev server will run at http://localhost:3009, but this can be changed in the `package.json` file.

## 🧹 Clean Project Setup

> To Get Rid of all example codes:

- Delete the folder Example in the **components** directory

- Delete **example-api-fetch** and **example-page** folder in the pages directory

> Delete any unused icons and images:

- Icon components can be found in the **Icon folder in the components directory**, and svg icons can be found in the **icons folder in the public directory**

> ⚠️WARNING : Unfortunately, some core components are using some of the icons in the above mentioned directories, so please remove with caution.
> Remove any unused libraries:

- Feel free to npm uninstall any libraries that wont be used in your web app. Please be careful about removing any core libraries

> 🔴 Other Advice :
> You may feel some implemented features are not needed in your web app, or you decide to use a different approach.
> For example: login, auth, data fetching, etc, certain components that you are sure will never be used in your app, feel free to remove them.

- Again, please proceed with caution when deciding what to keep and what to remove in your app.

> 🔴 Suggestion : Examples are provided in this template to help you get a quick start. They can be a good reference when you are stuck or need help, it may be wise to delete them afterwards when you are more familiar with how to use this template.

_**😎 Happy Coding! Wish you all the best in your project!**_

## Layout

The template uses a HOC (higher order component) design pattern to render the shared layout of each page. At the \_app.tsx level you will find this HOC wrapping our entire application like so:

```
 <Provider store={store}>
    <ThemeProvider theme={theme}>
      <RouteGuard>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </RouteGuard>
    </ThemeProvider>
  </Provider>
```

This renders important UI elements that appear on every page without requiring
you to constantly import them, with the most common components being the navigation bar, user login info, any applicaton structure elements, and more.

By default the template <b>automatically</b> shows the navbar and header bar
when the user logged in, and not when the user is logged out. This logic lives
within the AppLayout.tsx component and depends on the isAuthorized state
provided by the useIsAuthorized custom hook. This logic can be easily changed to fit your application by removing this conditional inside AppLayout.tsx:

```
 {isAuthorized ? (
    <AuthLayout>{children}</AuthLayout>
  ) : (
    <DefaultLayout>{children}</DefaultLayout>
  )}
```

You can also change which layout is showing via redux by dispatching the
layout state of the application and providing the valid <b>enum value</b> LayoutType (imported from /shared/constants/enum) which indicates the choice of layout. Example:

```
// import the enum
import { LayoutType } from 'shared/constants/enums';
// react-redux useAppDispatch for dispatch
import { useAppDispatch } from '@/state/store';
// the reducer from the layoutSlice of the app
import { selectLayout } from 'state/slices/layoutSlice';

// .. later in your code dispatch layoutChoice
const dispatch = useAppDispatch();
dispatch(selectLayout(LayoutType.DEFAULT));
```

## 🧩 Components

| Components | Description                                                                                                                                                                                                                                                                                                                                                 | MUI | Tailwind       |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | -------------- |
| Input      | A simple input field that comes with many utilities. This input component uses a callback property instead of an onChange event. See code implementation for more information. Input also supports validation via formik                                                                                                                                    | ✅  | Coming soon... |
| Select     | Select component made from [React Select](https://react-select.com/), it also provides multi select and validation                                                                                                                                                                                                                                          | ✅  | Coming soon... |
| Radio      | Customizable radio component with validation                                                                                                                                                                                                                                                                                                                | ✅  | Coming soon... |
| Tabs       | Tab component comes in 2 styles, default style is tabs with highlight colors, to change the style to panel style, add the prop 'panel' to the Tabs component. To remove default ripple effects add the 'disableRipple' prop to the Tab component. By styling css, Any custom tab styles can be created as an individual component. For Example:RoundedTabs  | ✅  | Coming soon... |
| Table      | Table can be customized to fit your needs ( customized table cells, show ellipsis if text is too long, row selection, pagination, links, sorting, etc. ) ※Functions such as sorting, row selection, and pagination needs to be implemented by the developer, This example only demonstrates the available front-end features the table component can offer. | ✅  | Coming soon... |
| Modal      | Create your own modal template and pass the template to as children to the redux dialog state (along with additional props like width and height...etc) when dispatching the setDialog action.                                                                                                                                                              | ✅  | Coming soon... |
| Datepicker | This datepicker uses the [react datepicker library](https://reactdatepicker.com/). You can customize the datepicker to suit your needs.                                                                                                                                                                                                                     | ✅  | Coming soon... |
| Loaders    | This template provides 2 types of loader libraries [react-loading-icons](https://loading.damiankress.de/) and [Loaders UI Ball](https://uiball.com/loaders/).                                                                                                                                                                                               | ✅  | Coming soon... |

## 🪝Custom Hooks

### useLogout

> Wraps all the logout methods into one, clearing your accessToken and refreshToken and rerouting the user in one neat function.

Usage:

```
import useLogout from 'hooks/useLogout';

// in your component
const logout = useLogout();

// when you want to handle logging out the user
logout();
```

By default this is called upon clicking the logout button located in the header, simply import it anywhere else in your app and call it to handle logout.

## ❓Who uses this template?

<a>![Gilat](https://res.cloudinary.com/dfkw9hdq3/image/upload/v1662387445/CI-Temp/gl.svg)</a> &nbsp;&nbsp;&nbsp;&nbsp; <a>![JustKitchen](https://res.cloudinary.com/dfkw9hdq3/image/upload/v1662387444/CI-Temp/jk.svg)</a>
