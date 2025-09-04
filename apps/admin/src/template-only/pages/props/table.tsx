import React from 'react';
import { Box, Collapse, Divider } from '@mui/material';

const table = () => {
	return (
		<>
			<Box sx={{ width: '1000px' }}>
				<Box sx={{ fontSize: '24px', fontWeight: 700 }}>Table Props</Box>
				<Box mt='12px'>props of table</Box>
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>type</Box>
					<Box mt='12px'>
						The enum TableType define the name of header column configurations which defined in tableConfig.ts
					</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: enum
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>isLoading</Box>
					<Box mt='12px'>Show loading animation</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: boolean
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>hideTableFooter</Box>
					<Box mt='12px'>Hide table footer</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: boolean
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>selectable</Box>
					<Box mt='12px'>Show checkbox at first colum of row</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: boolean
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>handleCheckedList</Box>
					<Box mt='12px'>When you click the checkbox, it triggers a callback function with a string array of id.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: function
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>draggable</Box>
					<Box mt='12px'>Show dragger at first colum of row</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: boolean
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>handleDragEnd</Box>
					<Box mt='12px'>When you release the dragger, it triggers a callback function.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: function
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>height</Box>
					<Box mt='12px'>Custom table's content height</Box>
					<Box mt='12px'>
						<strong>Type</strong>: string | number
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>children</Box>
					<Box mt='12px'>Pass in the main content. string, reactNode, etc.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: any
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>dataCount</Box>
					<Box mt='12px'>Table's data count, if 0 then show no data row</Box>
					<Box mt='12px'>
						<strong>Type</strong>: number
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>pageResetDeps</Box>
					<Box mt='12px'>Reset current_page to 1 by property [type]</Box>
					<Box mt='12px'>
						<strong>Type</strong>: any
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>defaultOrderBy</Box>
					<Box mt='12px'>Default order column </Box>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>defaultOrder</Box>
					<Box mt='12px'>Default order desc/asc. </Box>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>headData</Box>
					<Box mt='12px'>Define header columns.</Box>
					<Box mt='12px'>
						<strong>Type</strong>:{' '}
						{`{ name: string; width?: string | number | undefined; sort?: boolean | undefined; end?: boolean | undefined; }`}
					</Box>
				</Box>
				<Divider />
			</Box>
			<Box sx={{ marginTop: '60px', width: '1000px' }}>
				<Box sx={{ fontSize: '24px', fontWeight: 700 }}>Table Row Props</Box>
				<Box mt='12px'>props of table row</Box>
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>children</Box>
					<Box mt='12px'>Pass in the main content. string, reactNode, etc.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: any
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>selectable</Box>
					<Box mt='12px'>Show checkbox at first colum of row</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: boolean
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>handleChecked</Box>
					<Box mt='12px'>When you click the checkbox, it triggers a callback function with a boolean check status.</Box>
					<Box mt='12px'>
						<strong>Type</strong>: function
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>controlChecked</Box>
					<Box mt='12px'>Set checked of checkbox</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: boolean
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>draggable</Box>
					<Box mt='12px'>Show dragger at first colum of row</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: boolean
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>draggableId</Box>
					<Box mt='12px'>Dragger identity id, is required and unique</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>draggableIndex</Box>
					<Box mt='12px'>Dragger identity index, is required and unique</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: number
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>linkto</Box>
					<Box mt='12px'>link url</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: string
					</Box>
				</Box>
				<Divider />
			</Box>
			<Box sx={{ marginTop: '60px', width: '1000px' }}>
				<Box sx={{ fontSize: '24px', fontWeight: 700 }}>Table Cell Props</Box>
				<Box mt='12px'>props of table cell</Box>
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>draggable</Box>
					<Box mt='12px'>Show dragger at first colum of row</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: boolean
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>isDragging</Box>
					<Box mt='12px'>When dragging change css style.</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: boolean
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>sticky</Box>
					<Box mt='12px'>Sticky column.</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: number
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>rowRef</Box>
					<Box mt='12px'>Table row html element.</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: HTMLTableRowElement
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>align</Box>
					<Box mt='12px'>
						Set the text-align on the table cell content. Monetary or generally number fields **should be right
						aligned** as that allows you to add them up quickly in your head without having to worry about decimals.
						@default 'inherit'
					</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: 'inherit' | 'left' | 'center' | 'right' | 'justify'
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>children</Box>
					<Box mt='12px'>The content of the component.</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: React.ReactNode
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>classes</Box>
					<Box mt='12px'>Override or extend the styles applied to the component.</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: {`Partial<TableCellClasses>`}
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>component</Box>
					<Box mt='12px'>
						The component used for the root node. Either a string to use a HTML element or a component.
					</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: {`React.ElementType<TableCellBaseProps>`}
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>padding</Box>
					<Box mt='12px'>
						Sets the padding applied to the cell. The prop defaults to the value (`'default'`) inherited from the parent
						Table component.
					</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: 'normal' | 'checkbox' | 'none'
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>scope</Box>
					<Box mt='12px'>Set scope attribute.</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: {`TableCellBaseProps['scope']`}
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>size</Box>
					<Box mt='12px'>
						Specify the size of the cell. The prop defaults to the value (`'medium'`) inherited from the parent Table
						component.
					</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: {`OverridableStringUnion<'small' | 'medium', TableCellPropsSizeOverrides>`}
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>sortDirection</Box>
					<Box mt='12px'>Set aria-sort direction.</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: SortDirection
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>sx</Box>
					<Box mt='12px'>The system prop that allows defining system overrides as well as additional CSS styles.</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>: {`SxProps<Theme>`}
					</Box>
				</Box>
				<Divider />
				<Box my='20px'>
					<Box sx={{ color: '#0072E5', fontWeight: 700 }}>variant</Box>
					<Box mt='12px'>
						Specify the cell type. The prop defaults to the value inherited from the parent TableHead, TableBody, or
						TableFooter components.
					</Box>
					<Collapse></Collapse>
					<Box mt='12px'>
						<strong>Type</strong>:{' '}
						{`OverridableStringUnion<'head' | 'body' | 'footer', TableCellPropsVariantOverrides>`}
					</Box>
				</Box>
				<Divider />
			</Box>
		</>
	);
};

export default table;
