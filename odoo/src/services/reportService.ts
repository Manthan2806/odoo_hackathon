import { AllocationStatus, AssetStatus, MaintenanceStatus } from '../lib/prisma-client';
import { prisma } from '../config/prisma';

export async function getSummaryReport() {
  const [assetsInMaintenance, activeValue, laptopAllocations] = await Promise.all([
    prisma.maintenance.count({ where: { status: { in: [MaintenanceStatus.SCHEDULED, MaintenanceStatus.IN_PROGRESS] } } }),
    prisma.asset.aggregate({ where: { status: AssetStatus.ALLOCATED }, _sum: { currentValue: true } }),
    prisma.allocation.groupBy({
      by: ['employeeId'],
      where: { status: AllocationStatus.ACTIVE, asset: { category: { name: { equals: 'laptop', mode: 'insensitive' } } } },
      _count: { _all: true },
    }),
  ]);

  const employees = await prisma.employee.findMany({
    where: { id: { in: laptopAllocations.map((row) => row.employeeId) } },
    include: { department: true },
  });
  const departmentCounts = new Map<string, { departmentId: string; name: string; count: number }>();
  for (const allocation of laptopAllocations) {
    const employee = employees.find((item) => item.id === allocation.employeeId);
    if (!employee) continue;
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
