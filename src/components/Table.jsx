import MaterialTable from "@material-table/core";

const Table = ({ localization, options, ...props }) => {
  return (
    <MaterialTable
      options={{
        actionsColumnIndex: -1,
        pageSize: 10,
        pageSizeOptions: [5, 10, 20, 50, 100],
        ...options,
      }}
      localization={{
        toolbar: {
          searchTooltip: "Buscar",
          searchPlaceholder: "Buscar",
          exportTitle: "Exportar",
        },
        header: {
          actions: "Acciones",
        },
        pagination: {
          labelRowsSelect: "Filas",
          firstTooltip: "Ir al principio",
          nextTooltip: "Página siguiente",
          previousTooltip: "Página anterior",
          lastTooltip: "Ir al final",
          labelDisplayedRows: "{from}-{to} de {count}",
          labelRowsPerPage: "",
        },
        ...localization,
      }}
      {...props}
    />
  );
};

export default Table;
