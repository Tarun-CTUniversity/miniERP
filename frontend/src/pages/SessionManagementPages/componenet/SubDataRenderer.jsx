import React from 'react';
import CustomForm from '../../../component/CustomForm';

/**
 * A reusable component to render a list of dynamic data forms (e.g., departments, schools, classes).
 *
 * @param {Object[]} items - Array of data objects to be rendered using CustomForm.
 * @param {Object} formSchema - Object containing layout, style, and form behavior configuration.
 * @param {Object[]} validationArray - Array of validation states corresponding to each item.
 * @param {Function} onDelete - Callback triggered when an item is deleted. Accepts index as argument.
 * @param {Function} onUpdate - Callback triggered when an item is updated. Accepts updated item and index.
 * @param {string} mode - String indicating rendering mode ('add', 'edit', 'active', etc.).
 */
const SubDataRenderer = ({
  items,
  formSchema,
  options,
  validationArray,
  onDelete,
  onUpdate,
  mode,
  style
}) => {
    const NULLDATA = formSchema.names.map((val) => null);
  return (
    <div style={style}>
      {items.map((item, index) => (
        <CustomForm
          key={item.id || index}
          data={item}
          columns={formSchema.columns}
          names={formSchema.names}
          tags={formSchema.tags}
          types={formSchema.types}
          placeholders={formSchema.placeholders}
          required={formSchema.required}
          options={options|| NULLDATA}
          dependencies={formSchema.dependencies || NULLDATA}
          styles={formSchema.styles}
          rowStarts={formSchema.rowStarts}
          rowSpans={formSchema.rowSpans}
          colStarts={formSchema.colStarts}
          colSpans={formSchema.colSpans}
          useFunction={formSchema.useFunction || NULLDATA}
          valid={validationArray[index]}
          onDelete={() => onDelete(mode,index)}
          onUpdate={(updatedData) => onUpdate(mode, index,updatedData)}
          mode={mode}
          deletionAllowed={formSchema.deletionAllowed}
        />
      ))}
    </div>
  );
};

export default SubDataRenderer;
