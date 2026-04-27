import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Phone, MapPin, Search, Filter, UserX, UserCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAllUsers, deleteUser, toggleUserStatus } from "@/services/adminApi";
import { sessionStore } from "@/lib/session";
import { toast } from "@/hooks/use-toast";
import type { ApiUser } from "@/types/api";

const AdminUsers = () => {
  const token = sessionStore.getToken();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const { data: users, isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => fetchAllUsers(token),
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(token, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast({ title: "User deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: boolean }) =>
      toggleUserStatus(token, userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast({ title: "User status updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const filteredUsers = users?.data?.filter((user: ApiUser) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phoneNumber.includes(searchQuery);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "farmer":
        return "bg-primary text-primary-foreground";
      case "buyer":
        return "bg-secondary text-secondary-foreground";
      case "admin":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleDelete = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      deleteMutation.mutate(userId);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-gentle-rise space-y-4">
        <div className="h-32 animate-pulse rounded-3xl bg-muted" />
        <div className="h-96 animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="animate-gentle-rise space-y-6">
      {/* Header */}
      <Card className="rounded-3xl border-2 shadow-touch">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <div className="grid size-12 place-items-center rounded-2xl bg-primary text-2xl text-primary-foreground">
              👥
            </div>
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border bg-surface-leaf p-4">
              <p className="text-sm font-bold text-muted-foreground">Total Users</p>
              <p className="text-3xl font-black">{users?.data?.length || 0}</p>
            </div>
            <div className="rounded-2xl border bg-surface-warm p-4">
              <p className="text-sm font-bold text-muted-foreground">Farmers</p>
              <p className="text-3xl font-black text-primary">
                {users?.data?.filter((u: ApiUser) => u.role === "farmer").length || 0}
              </p>
            </div>
            <div className="rounded-2xl border bg-earth-soft p-4">
              <p className="text-sm font-bold text-muted-foreground">Buyers</p>
              <p className="text-3xl font-black text-secondary">
                {users?.data?.filter((u: ApiUser) => u.role === "buyer").length || 0}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-2xl pl-10 font-semibold"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full rounded-2xl font-semibold sm:w-48">
                <Filter className="mr-2 size-4" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="farmer">Farmers</SelectItem>
                <SelectItem value="buyer">Buyers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="rounded-3xl border-2 shadow-touch">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2">
                  <TableHead className="font-black">User</TableHead>
                  <TableHead className="font-black">Contact</TableHead>
                  <TableHead className="font-black">Role</TableHead>
                  <TableHead className="font-black">Location</TableHead>
                  <TableHead className="font-black">Joined</TableHead>
                  <TableHead className="text-right font-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user: ApiUser) => (
                  <TableRow key={user.id} className="border-b">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.name}
                            className="size-10 rounded-full border-2 border-primary object-cover"
                          />
                        ) : (
                          <div className="grid size-10 place-items-center rounded-full bg-surface-leaf text-xl">
                            👤
                          </div>
                        )}
                        <div>
                          <p className="font-bold">{user.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {user.id.slice(-8)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="size-4 text-muted-foreground" />
                          <span className="font-semibold">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="size-4 text-muted-foreground" />
                          <span className="font-semibold">{user.phoneNumber}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`rounded-xl font-bold ${getRoleBadgeColor(user.role)}`}>
                        {user.role.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-muted-foreground" />
                        <span className="font-semibold">{user.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                          onClick={() =>
                            toggleStatusMutation.mutate({ userId: user.id, status: true })
                          }
                        >
                          <UserCheck className="size-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => handleDelete(user.id, user.name)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredUsers?.length === 0 && (
            <div className="py-12 text-center">
              <UserX className="mx-auto size-12 text-muted-foreground" />
              <p className="mt-2 font-bold text-muted-foreground">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
