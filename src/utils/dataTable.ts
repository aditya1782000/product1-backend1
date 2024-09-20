interface Body {
    search: {
        value: string;
    };
    columns: {
        [index: number]: {
            data: string;
        };
    };
    order: {
        [index: number]: {
            column: number;
            dir: string;
        };
    };
}

interface SearchData {
    $or?: Array<{ [key: string]: string | number | RegExp }>;
}

interface SortingOrder {
    [key: string]: number;
}

interface DataTable {
    initDataTable: (
        oBody: Body,
        aSearchKey: string[],
        sFirstColumn: string,
        numberField?: string[],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) => { oSearchData: any; oSortingOrder: any };
}

const oDataTable: DataTable = {
    initDataTable: (
        oBody: Body,
        aSearchKey: string[],
        sFirstColumn: string,
        numberField?: string[],
    ) => {
        const searchValue = oBody.search.value;

        const oSearchData: SearchData = {
            $or: [],
        };

        for (const key of aSearchKey) {
            if (numberField && numberField.includes(key)) {
                const numberValue = parseFloat(searchValue);

                if (!isNaN(numberValue)) {
                    oSearchData.$or!.push({ [key]: numberValue });
                }
            } else {
                const regex = new RegExp(`.*${searchValue}.*`, 'i');
                oSearchData.$or!.push({ [key]: regex });
            }
        }

        if (!oSearchData['$or']!.length) delete oSearchData['$or'];

        let oSortingOrder: SortingOrder = {
            dCreatedAt: -1,
        };

        const columnData = oBody.columns[oBody.order[0].column].data;

        if (columnData !== sFirstColumn) {
            oSortingOrder = {};
            oSortingOrder[columnData] = oBody.order[0].dir === 'asc' ? 1 : -1;
        }

        return { oSearchData, oSortingOrder };
    },
};

export default oDataTable;
