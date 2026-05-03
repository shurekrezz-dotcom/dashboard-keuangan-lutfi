<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    // GET /api/transactions
    public function index(Request $request)
    {
        $query = Transaction::where('user_id', $request->user()->id);

        if ($request->startDate) {
            $query->whereDate('created_at', '>=', $request->startDate);
        }
        if ($request->endDate) {
            $query->whereDate('created_at', '<=', $request->endDate);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    // POST /api/transactions
    public function store(Request $request)
    {
        $transaction = Transaction::create([
            'user_id' => $request->user()->id,
            'name'    => $request->name,
            'nominal' => $request->nominal,
        ]);

        return response()->json($transaction, 201);
    }

    // DELETE /api/transactions/{id}
    public function destroy(Request $request, $id)
    {
        $transaction = Transaction::where('user_id', $request->user()->id)
                                  ->findOrFail($id);
        $transaction->delete();

        return response()->json(['message' => 'Deleted']);
    }

    // DELETE /api/transactions
    public function destroyAll(Request $request)
    {
        $count = Transaction::where('user_id', $request->user()->id)->count();
        Transaction::where('user_id', $request->user()->id)->delete();

        return response()->json($count);
    }
}