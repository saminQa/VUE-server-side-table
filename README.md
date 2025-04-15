# Reusable CRUD Table

A reusable, responsive, CRUD server-side table component built with Vue.js and vuetify. This component provides a flexible, easy and customizable way to display and manage data in a table format.

### Features
 
- Data Management: Display, create, update, and delete your server-side data with ease
- Show row data by clicking at the row (readonly)
- Customizable Columns: Define your own columns, including headers, data types
- Filtering and Sorting: Filter server data by column values, search in multiple columns
- Pagination: Paginate data for easier navigation and management
- Responsive Design: Works well on various screen sizes and devices
- Error Handling: Displays error messages and alerts for user feedback

### Usage

To use this component, simply import it into your Vue.js project and pass in the required props. You can customize the component's behavior and appearance by passing in your own data, columns, and options.

### Example Use Cases

This repository includes two example components that demonstrate how to use the Reusable CRUD Table:

#### ParentComponent.vue:
- A simple example that displays a table with sample data and allows users to create, update and filter data. It also allows to easily get your back-end data, set columns to show when mounted, easily set column filters and connect it to the back-end data.
#### ChildForm.vue:
- An example form that opens a new record, or fills the form with row data.

### Getting Started

Clone this repository.
Import the Reusable CRUD Table component into your Vue.js project.
Pass in the required props, such as data, columns, and options - see explanation in the props, or the parent component.
Customize the component's behavior and appearance as needed.

### Contributing

Contributions are welcome! If you have any ideas or bug fixes, please submit a pull request or issue.

License

This component is released under the MIT License.
