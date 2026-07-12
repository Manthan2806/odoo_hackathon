"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummaryReport = getSummaryReport;
const prisma_client_1 = require("../lib/prisma-client");
const prisma_1 = require("../config/prisma");
async function getSummaryReport() {
    const [assetsInMaintenance, activeValue, laptopAllocations] = await Promise.all([
        prisma_1.prisma.maintenance.count({ where: { status: { in: [prisma_client_1.MaintenanceStatus.SCHEDULED, prisma_client_1.MaintenanceStatus.IN_PROGRESS] } } }),
        prisma_1.prisma.asset.aggregate({ where: { status: prisma_client_1.AssetStatus.ALLOCATED }, _sum: { currentValue: true } }),
        prisma_1.prisma.allocation.groupBy({
            by: ['employeeId'],
            where: { status: prisma_client_1.AllocationStatus.ACTIVE, asset: { category: { name: { equals: 'laptop', mode: 'insensitive' } } } },
            _count: { _all: true },
        }),
    ]);
    const employees = await prisma_1.prisma.employee.findMany({
        where: { id: { in: laptopAllocations.map((row) => row.employeeId) } },
        include: { department: true },
    });
    const departmentCounts = new Map();
    for (const allocation of laptopAllocations) {
        const employee = employees.find((item) => item.id === allocation.employeeId);
        if (!employee)
            continue;
        const current = departmentCounts.get(employee.departmentId) ?? { departmentId: employee.departmentId, name: employee.department.name, count: 0 };
        current.count += allocation._count._all;
        departmentCounts.set(employee.departmentId, current);
    }
    const departmentWithMostLaptops = [...departmentCounts.values()].sort((a, b) => b.count - a.count)[0] ?? null;
    return {
        totalAssetsInMaintenance: assetsInMaintenance,
        totalMonetaryValueOfActiveAssets: activeValue._sum.currentValue?.toString() ?? '0',
        departmentWithMostLaptops,
    };
}
