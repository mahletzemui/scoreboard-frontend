/**
 * Defines models to package the application's query data.
 */

// --------------------------------------------------------------------------------

/**
 * Represents option models.
 */
export interface Option
{
    name: string,
    label: string,
    icon?: string[],
    additional?: Option[],
    active: boolean
}


/**
 * Represents selector models.
 */
export interface Selector
{
    heading: string,
    options: Option[]
}


/**
 * Represents base filter models.
 */
interface BaseFilter { heading: string, unique: boolean }

/**
 * Represents checkbox filter models.
 */
export interface CheckFilter extends BaseFilter
{ 
    type: 'check',
    options: Option[] 
}

/**
 * Represents date filter models.
 */
export interface DateFilter extends BaseFilter 
{ 
    type: 'date',
    from: string,
    startDate?: number, 
    to: string,
    endDate?: number 
}

/**
 * Represents filter models.
 */
export type Filter = CheckFilter|DateFilter;


/**
 * Represents page models.
 */
export interface Page
{
    size: number,
    index: number
}


/**
 * Represents donut slice models.
 */
export interface Slice {
    label: string,
    value: number,
    color: string,
    percentage: { value: number, xPos: number, yPos: number },
    angle: { start: number, end: number },
    path: string
}
